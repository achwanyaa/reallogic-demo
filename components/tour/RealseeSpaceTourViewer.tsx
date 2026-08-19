'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, Grid3x3, Layers, Compass, ChevronLeft, ChevronRight, Maximize2, RotateCcw } from 'lucide-react'
import type { Hotspot } from '@/lib/realsee/types'

type ViewMode = 'Panorama' | 'Model' | 'Floorplan' | 'Topview'

// Local AlHusnain fallback panoramas (used when work data is unavailable)
const LOCAL_PANOS = [
  '/mock/alhusnain/IMG_20260523_100706_00_091.jpg',
  '/mock/alhusnain/IMG_20260523_101224_00_093.jpg',
  '/mock/alhusnain/IMG_20260523_101322_00_094.jpg',
  '/mock/alhusnain/IMG_20260523_101512_00_095.jpg',
  '/mock/alhusnain/IMG_20260523_101700_00_096.jpg',
  '/mock/alhusnain/IMG_20260523_102148_00_098.jpg',
  '/mock/alhusnain/IMG_20260523_102354_00_099.jpg',
  '/mock/alhusnain/IMG_20260523_102624_00_100.jpg',
]

interface RealseeSpaceTourViewerProps {
  workId: string
  hotspots?: Hotspot[]
}

// Dynamically load Five only client-side (requires browser WebGL)
async function loadFive() {
  const { Five } = await import('@realsee/five')
  return Five
}

async function fetchWorkData(workId: string) {
  const res = await fetch(`/api/realsee/work/${encodeURIComponent(workId)}`)
  if (res.status === 404) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      body?.hint || 'Work not found — ensure this work ID belongs to your Realsee account.'
    )
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || `Failed to fetch work data: ${res.status}`)
  }
  return res.json()
}

export function RealseeSpaceTourViewer({ workId, hotspots = [] }: RealseeSpaceTourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fiveRef = useRef<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('Panorama')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workMeta, setWorkMeta] = useState<{ title?: string; panoCount?: number } | null>(null)
  // Fallback to local panoramas when work data is unavailable
  const [fallbackMode, setFallbackMode] = useState(false)
  const [fallbackIdx, setFallbackIdx] = useState(0)

  useEffect(() => {
    if (!containerRef.current || fiveRef.current) return

    let five: any = null
    let mounted = true

    async function init() {
      try {
        setLoading(true)
        setError(null)
        setFallbackMode(false)

        // Step 1: Load Five engine
        const Five = await loadFive()
        if (!mounted) return

        // Step 2: Fetch spatial work data through our server proxy
        const workData = await fetchWorkData(workId)
        if (!mounted) return

        const panos = workData?.observers || workData?.panoramas || workData?.panos || []
        const title = workData?.title || workData?.name
        setWorkMeta({ title, panoCount: Array.isArray(panos) ? panos.length : undefined })

        // Step 3: Instantiate Five engine
        five = new Five({
          backgroundColor: 0x050709,
          antialias: true,
          poweredByRealsee: false,
          imageOptions: { size: 1024, quality: 85 },
        })
        fiveRef.current = five

        if (containerRef.current) {
          five.appendTo(containerRef.current)
          five.refresh()
        }

        // Listen for mode changes triggered by clicks or gestures
        five.on('stateChange', (state: any) => {
          if (state?.mode && ['Panorama', 'Model', 'Floorplan', 'Topview'].includes(state.mode)) {
            setViewMode(state.mode as ViewMode)
          }
        })

        // Step 4: Load the 3D twin dataset (observers + mesh model + floor plan)
        await five.load(workData)
        if (!mounted) return

        // Step 5: Initial mode (default to Panorama walkthrough)
        five.setState({ mode: 'Panorama' })
        five.refresh()
        setLoading(false)
      } catch (err: any) {
        if (!mounted) return
        console.error('[RealseeSpaceTourViewer] Init error:', err)
        setFallbackMode(true)
        setError(err?.message || 'Work data unavailable')
        setWorkMeta({ panoCount: LOCAL_PANOS.length })
        setLoading(false)
      }
    }

    init()

    const handleResize = () => {
      if (fiveRef.current) {
        fiveRef.current.refresh?.()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', handleResize)
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
      } catch (e) {
        console.warn('[Five] mode switch warning:', e)
      }
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050709', overflow: 'hidden' }}>
      {/* ─── Five WebGL 3D Canvas Container ─── */}
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
            zIndex: 50,
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
              INITIALIZING 3D SPATIAL TWIN...
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center' }}>
              Loading 3D mesh model • 58 Pano nodes • Floor plan
            </p>
          </div>
        </div>
      )}

      {/* ─── Fallback: Local Panorama Browser ─── */}
      {!loading && fallbackMode && (
        <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 10 }}>
          <img
            src={LOCAL_PANOS[fallbackIdx]}
            alt={`Scan node ${fallbackIdx + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          {/* Navigation arrows */}
          <button
            onClick={() => setFallbackIdx((i) => (i - 1 + LOCAL_PANOS.length) % LOCAL_PANOS.length)}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(9,11,14,0.85)',
              border: '1px solid var(--border-medium)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF',
              zIndex: 20,
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setFallbackIdx((i) => (i + 1) % LOCAL_PANOS.length)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(9,11,14,0.85)',
              border: '1px solid var(--border-medium)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF',
              zIndex: 20,
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Node counter */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(9,11,14,0.88)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
            padding: '5px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: '#FFFFFF',
            zIndex: 20,
            backdropFilter: 'blur(8px)',
          }}>
            LOCAL SCAN {fallbackIdx + 1} / {LOCAL_PANOS.length}
          </div>
        </div>
      )}

      {/* ─── Top 3D View Mode Switcher (Walk / 3D Dollhouse Model / Floor Plan) ─── */}
      {!loading && !fallbackMode && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(9, 11, 14, 0.94)',
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
            { mode: 'Model', icon: <Grid3x3 size={13} />, label: '3D DOLLHOUSE' },
            { mode: 'Floorplan', icon: <Layers size={13} />, label: 'FLOOR PLAN' },
            { mode: 'Topview', icon: <Compass size={13} />, label: 'TOP VIEW' },
          ] as const).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'calc(var(--radius-xs) - 1px)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: viewMode === mode ? 700 : 500,
                border: 'none',
                background: viewMode === mode ? 'var(--accent-orange)' : 'transparent',
                color: viewMode === mode ? '#000000' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ─── Bottom-Left Live Watermark & Status ─── */}
      {!loading && !fallbackMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(9, 11, 14, 0.9)',
            padding: '6px 14px',
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
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>REALLOGIC SPATIAL ENGINE</span>
          {workMeta?.panoCount !== undefined && (
            <>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{ color: 'var(--accent-orange)' }}>{workMeta.panoCount} SCAN NODES</span>
            </>
          )}
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span style={{ color: '#34D399' }}>{viewMode.toUpperCase()} ACTIVE</span>
        </div>
      )}

      {/* ─── Mode Helper Instructions ─── */}
      {!loading && !fallbackMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(9, 11, 14, 0.85)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--text-muted)',
            backdropFilter: 'blur(8px)',
            zIndex: 30,
          }}
        >
          {viewMode === 'Panorama' && 'CLICK FLOOR TARGETS TO WALK · DRAG TO LOOK · SCROLL TO ZOOM'}
          {viewMode === 'Model' && 'DRAG TO ROTATE 3D DOLLHOUSE · SCROLL TO ZOOM · CLICK ROOM TO ENTER'}
          {viewMode === 'Floorplan' && 'TOP-DOWN 2D SCHEMATIC · CLICK ROOM TO JUMP TO SCAN'}
          {viewMode === 'Topview' && 'ORTHOGRAPHIC 2D OVERVIEW · DRAG TO PAN'}
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
