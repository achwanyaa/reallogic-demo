'use client'

import Link from 'next/link'
import { TierBadge } from '@/components/ui/TierBadge'
import { Users, Building2, FileSpreadsheet, Layers, ArrowUpRight, Lock } from 'lucide-react'

interface Tier3Card {
  title: string
  specCode: string
  description: string
  icon: typeof Users
  badgeText: string
  href?: string
}

const TIER3_FEATURES: Tier3Card[] = [
  {
    title: 'LIVE CO-VIEWING (MULTI-TENANT)',
    specCode: 'RTC-SYNC-V3',
    description:
      'Synchronized multi-user spatial sessions with tenant audio, broker laser pointer, and real-time floor plan orientation.',
    icon: Users,
    badgeText: 'COMING WITH PARTNERSHIP',
  },
  {
    title: 'SCAN-TO-BIM / CAD EXPORT',
    specCode: 'AUTODESK-IFC-REVIT',
    description:
      'Direct conversion from on-site LiDAR point clouds into Revit (.RVT), IFC, and 2D CAD DWG structural layers.',
    icon: Building2,
    badgeText: 'COMING WITH PARTNERSHIP',
  },
  {
    title: 'ENGINEERING DOSSIER / PACKET',
    specCode: 'PDF-CERT-A4',
    description:
      'Instant one-click generation of certified structural PDF dossiers, clearance reports, and physical site verification audits.',
    icon: FileSpreadsheet,
    badgeText: 'PREVIEW READY',
    href: 'packet',
  },
]

export function Tier3PreviewCards({ listingId }: { listingId: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
      }}
    >
      {TIER3_FEATURES.map((feature) => {
        const Icon = feature.icon
        const isClickable = !!feature.href
        const href = feature.href ? `/listing/${listingId}/${feature.href}` : '#'

        const cardContent = (
          <div
            className="hud-panel"
            style={{
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: isClickable ? 1 : 0.85,
              borderColor: isClickable ? 'var(--border-medium)' : 'var(--border-subtle)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  <Icon size={18} />
                </div>
                <TierBadge tier="coming-with-partnership" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
                  [{feature.specCode}]
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  marginBottom: '8px',
                  color: '#FFFFFF',
                }}
              >
                {feature.title}
              </h4>

              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              {isClickable ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-orange)',
                    fontWeight: 600,
                  }}
                >
                  <span>OPEN TECHNICAL PACKET</span>
                  <ArrowUpRight size={14} />
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Lock size={12} />
                  <span>REQUIRES PARTNERSHIP TIER</span>
                </div>
              )}
            </div>
          </div>
        )

        if (isClickable) {
          return (
            <Link key={feature.title} href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
              {cardContent}
            </Link>
          )
        }

        return <div key={feature.title}>{cardContent}</div>
      })}
    </div>
  )
}
