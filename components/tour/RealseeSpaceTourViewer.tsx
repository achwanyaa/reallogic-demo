'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, Grid3x3, Layers, ZoomIn, ZoomOut, RotateCcw, Loader } from 'lucide-react'
import type { Hotspot } from '@/lib/realsee/types'

type ViewMode = 'Panorama' | 'Dollhouse' | 'Floorplan'

interface RealseeSpaceTourViewerProps {
  workId: string
  hotspots?: Hotspot[]
}

// Dynamically load Five only client-side (it requires browser WebGL)
async function loadFive() {
  const { Five } = await import('@realsee/five')
  return Five
}

async function fetchWorkData(workId: string) {
  const res = await fetch(`/api/realsee/work/${encodeURIComponent(workId)}`)
  if (!res.ok) throw new Error(`Failed to fetch work data: ${res.status}`)
  return res.json()
}

export function RealseeSpaceTourViewer({ workId, hotspots = [] }: RealseeSpaceTourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fiveRef = useRef<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('Panorama')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workMeta, setWorkMeta] = useState<{ title?: string; panoCount?: number } | null>(null)

  useEffect(() => {
    if (!containerRef.current || fiveRef.current) return

    let five: any = null
    let mounted = true

    async function init() {
      try {
        setLoading(true)
        setError(null)

        // Step 1: load Five class
        const Five = await loadFive()

        if (!mounted) return

        // Step 2: fetch work data through our server-side proxy
        const workData = await fetchWorkData(workId)

        if (!mounted) return

        // Extract useful metadata for the HUD
        const panos = workData?.observers || workData?.panoramas || workData?.panos || []
        const title = workData?.title || workData?.name
        setWorkMeta({ title, panoCount: Array.isArray(panos) ? panos.length : undefined })

        // Step 3: instantiate Five and attach to DOM container
        five = new Five({
          imageOptions: { size: 1024, quality: 85 },
        })
        fiveRef.current = five

        if (containerRef.current) {
          five.appendTo(containerRef.current)
        }

        // Step 4: load the spatial work data
        await five.load(workData)

        if (!mounted) return

        // Step 5: start with panorama walkthrough mode
        five.setState({ mode: 'Panorama' })
        setLoading(false)
      } catch (err: any) {
        if (!mounted) return
        console.error('[RealseeSpaceTourViewer] Init error:', err)
        setError(err?.message || 'Failed to initialize spatial twin')
        setLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
      if (fiveRef.current) {
        try {
          fiveRef.current.dispose?.()
          fiveRef.current = null
        } catch (_) {}
      }
    }
  }, [workId])

  const switchMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (fiveRef.current) {
      try {
        fiveRef.current.setState({ mode }, true, false)
      } catch (_) {}
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050709', overflow: 'hidden' }}>
      {/* ─── Five WebGL Container ─── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* ─── Loading State ─── */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050709',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid var(--border-subtle)',
              borderTopColor: 'var(--accent-orange)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
          <div>
            <p style={{ color: 'var(--accent-orange)', fontSize: '0.82rem', marginBottom: '4px' }}>
              LOADING SPATIAL DIGITAL TWIN...
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center' }}>
              Fetching 3D model • Pano meshes • Floor plan
            </p>
          </div>
        </div>
      )}

      {/* ─── Error State ─── */}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050709',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            padding: '32px',
          }}
        >
          <div style={{ width: '48px', height: '48px', border: '2px solid rgba(249, 115, 22, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--accent-orange)', fontSize: '1.4rem' }}>!</span>
          </div>
          <p style={{ color: 'var(--accent-orange)', fontSize: '0.82rem' }}>SPATIAL TWIN UNAVAILABLE</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5 }}>
            {error}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textAlign: 'center' }}>
            TWIN ID: {workId}
          </p>
        </div>
      )}

      {/* ─── Top View Mode Switcher ─── */}
      {!loading && !error && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(9, 11, 14, 0.92)',
            padding: '5px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-medium)',
            backdropFilter: 'blur(12px)',
            zIndex: 40,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          {([
            { mode: 'Panorama', icon: <Eye size={13} />, label: 'WALK' },
            { mode: 'Dollhouse', icon: <Grid3x3 size={13} />, label: 'DOLLHOUSE' },
            { mode: 'Floorplan', icon: <Layers size={13} />, label: 'FLOOR PLAN' },
          ] as const).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'calc(var(--radius-xs) - 1px)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: viewMode === mode ? 700 : 500,
                border: 'none',
                background: viewMode === mode ? 'rgba(249, 115, 22, 0.22)' : 'transparent',
                color: viewMode === mode ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                outline: viewMode === mode ? '1px solid rgba(249, 115, 22, 0.5)' : 'none',
              }}
            >
              <span style={{ color: viewMode === mode ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                {icon}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ─── Bottom-Left Live Watermark ─── */}
      {!loading && !error && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(9, 11, 14, 0.88)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-secondary)',
            backdropFilter: 'blur(8px)',
            zIndex: 30,
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-emerald)',
            boxShadow: '0 0 6px var(--accent-emerald)',
          }} />
          <span>REALLOGIC SPATIAL ENGINE</span>
          {workMeta?.panoCount !== undefined && (
            <>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{ color: 'var(--accent-orange)' }}>{workMeta.panoCount} SCAN NODES</span>
            </>
          )}
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span style={{ color: '#FFFFFF' }}>{viewMode.toUpperCase()} MODE</span>
        </div>
      )}

      {/* ─── Walk Mode Instruction Hint ─── */}
      {!loading && !error && viewMode === 'Panorama' && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(9, 11, 14, 0.82)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--text-muted)',
            backdropFilter: 'blur(8px)',
            zIndex: 30,
          }}
        >
          CLICK FLOOR TARGETS TO WALK · DRAG TO LOOK · SCROLL TO ZOOM
        </div>
      )}

      {/* CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
