/**
 * Resolves a Realsee work object from a share link or short code (e.g. "7kyyNwq8" or "80P29aOvr7kw98eDxE")
 * by extracting and resolving the SSR flight payload directly from Realsee.
 */
export async function fetchWorkFromShareLink(codeOrUrl: string): Promise<any | null> {
  try {
    let url = codeOrUrl
    if (!url.startsWith('http')) {
      // If it's a short code or tour ID
      url = codeOrUrl.startsWith('80')
        ? `https://realsee.ai/tour/${codeOrUrl}`
        : `https://realsee.ai/${codeOrUrl}`
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null
    const html = await res.text()

    // Extract all flight push chunks
    const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g
    let match
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

    // Parse RSC entries
    const lines = flightPayload.split('\n')
    const entries: Record<string, string> = {}
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0 && colonIdx < 10) {
        const id = line.substring(0, colonIdx)
        const content = line.substring(colonIdx + 1)
        entries[id] = content
      }
    }

    function resolveValue(val: any, depth = 0): any {
      if (depth > 25) return val
      if (typeof val === 'string' && val.startsWith('$')) {
        const refId = val.substring(1)
        if (refId === 'undefined') return undefined
        if (entries[refId]) {
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
    for (const [k, v] of Object.entries(entries)) {
      if (v.includes('base_url') && (v.includes('observers') || v.includes('panorama'))) {
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
