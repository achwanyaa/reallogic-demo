'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Crosshair } from 'lucide-react'
import type { Hotspot } from '@/lib/realsee/types'

const RealseeSpaceTourViewer = dynamic(
  () => import('./RealseeSpaceTourViewer').then((mod) => mod.RealseeSpaceTourViewer),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: 'var(--bg-void)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: 'var(--accent-orange)',
        }}
      >
        <span className="status-pulse-orange" style={{ marginRight: '8px' }} />
        INITIALIZING SPATIAL VIEWPORT...
      </div>
    ),
  }
)

interface DossierTourPreviewProps {
  listingId: string
  workId?: string
  hotspots?: Hotspot[]
}

export function DossierTourPreview({ listingId, workId = '80P29aOvr7kw98eDxE', hotspots = [] }: DossierTourPreviewProps) {
  return (
    <div
      className="hud-panel corner-brackets"
      style={{
        height: '460px',
        borderRadius: 'var(--radius-xs)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="hud-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crosshair size={14} color="var(--accent-emerald)" />
          <span>ACTIVE 3D DIGITAL TWIN • SPATIAL VIEWPORT</span>
        </div>
        <Link
          href={`/listing/${listingId}/tour`}
          className="mono-metric"
          style={{ fontSize: '0.72rem', color: 'var(--accent-orange)', textDecoration: 'none' }}
        >
          FULLSCREEN TOUR →
        </Link>
      </div>

      <div style={{ flex: 1, position: 'relative', background: '#000000' }}>
        <RealseeSpaceTourViewer
          workId={workId}
          hotspots={hotspots}
        />
      </div>
    </div>
  )
}
