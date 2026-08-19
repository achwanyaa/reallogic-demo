/**
 * Resolves a Realsee spatial work object from a share link or short code (e.g. "7kyyNwq8")
 * by extracting and resolving the complete SSR flight payload directly from Realsee.
 */
export async function fetchWorkFromShareLink(codeOrUrl: string): Promise<any | null> {
  try {
    let url = codeOrUrl
    if (!url.startsWith('http')) {
      url = codeOrUrl.startsWith('80')
        ? `https://realsee.ai/tour/${codeOrUrl}`
        : `https://realsee.ai/${codeOrUrl}`
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null
    const html = await res.text()

    // Extract all flight push chunks
    const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g
    let match: RegExpExecArray | null
    let flightPayload = ''

    while ((match = regex.exec(html)) !== null) {
      try {
        const unescaped = JSON.parse(`"${match[1]}"`)
        flightPayload += unescaped
      } catch {
        flightPayload += match[1]
      }
    }

    if (!flightPayload) return null

    // Parse RSC chunks handling typed lengths (e.g. T<hex_len>,)
    const entries: Record<string, string> = {}
    let pos = 0
    const str = flightPayload

    while (pos < str.length) {
      const colon = str.indexOf(':', pos)
      if (colon === -1) break

      const id = str.substring(pos, colon).trim()
      if (!id || id.includes(' ') || id.length > 8) {
        const nl = str.indexOf('\n', pos)
        if (nl === -1) break
        pos = nl + 1
        continue
      }

      pos = colon + 1
      if (str[pos] === 'T' || str[pos] === 'I' || str[pos] === 'M' || str[pos] === 'H') {
        const comma = str.indexOf(',', pos)
        if (comma !== -1 && comma - pos < 10) {
          const lenHex = str.substring(pos + 1, comma)
          const len = parseInt(lenHex, 16)
          if (!isNaN(len)) {
            const contentStart = comma + 1
            const content = str.substr(contentStart, len)
            entries[id] = content
            pos = contentStart + len
            if (str[pos] === '\n') pos++
            continue
          }
        }
      }

      const nl = str.indexOf('\n', pos)
      if (nl === -1) {
        entries[id] = str.substring(pos)
        break
      } else {
        entries[id] = str.substring(pos, nl)
        pos = nl + 1
      }
    }

    function resolveValue(val: any, depth = 0): any {
      if (depth > 30) return val
      if (typeof val === 'string' && val.startsWith('$')) {
        const refId = val.substring(1)
        if (refId === 'undefined') return undefined
        if (entries[refId] !== undefined) {
          try {
            const parsed = JSON.parse(entries[refId])
            return resolveObject(parsed, depth + 1)
          } catch {
            return entries[refId]
          }
        }
      }
      return val
    }

    function resolveObject(obj: any, depth = 0): any {
      if (!obj || typeof obj !== 'object') return resolveValue(obj, depth)
      if (Array.isArray(obj)) {
        return obj.map((item) => resolveObject(resolveValue(item, depth + 1), depth + 1))
      }
      const result: Record<string, any> = {}
      for (const [k, v] of Object.entries(obj)) {
        result[k] = resolveObject(resolveValue(v, depth + 1), depth + 1)
      }
      return result
    }

    // Find entry with base_url and observers (the work definition)
    for (const [, v] of Object.entries(entries)) {
      if (v.includes('base_url') && (v.includes('observers') || v.includes('panorama') || v.includes('model'))) {
        try {
          const parsed = JSON.parse(v)
          if (parsed && typeof parsed === 'object' && parsed.base_url) {
            const resolved = resolveObject(parsed)
            if (resolved && (resolved.observers || resolved.panorama || resolved.model)) {
              return resolved
            }
          }
        } catch {}
      }
    }

    return null
  } catch (err) {
    console.error('[fetchWorkFromShareLink] Error:', err)
    return null
  }
}
