import Link from 'next/link'
import {
  Boxes,
  Eye,
  Ruler,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  Building2,
  Gauge,
  Maximize2,
  Compass,
  ArrowRight,
  Printer,
  ChevronLeft,
  Crosshair,
} from 'lucide-react'
import { TierBadge } from '@/components/ui/TierBadge'
import { VerifiedBadge } from '@/components/listing/VerifiedBadge'
import { Tier3PreviewCards } from '@/components/listing/Tier3PreviewCards'
import { getListing, getCaptureVerification } from '@/lib/data'
import type { TierLevel } from '@/lib/realsee/types'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const listing = await getListing(id)
  const verification = await getCaptureVerification(id)

  if (!listing) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Listing Not Found</h1>
        <p style={{ color: 'var(--text-secondary)' }}>The requested listing does not exist.</p>
        <Link href="/" className="tech-btn-primary">
          <ChevronLeft size={16} />
          <span>RETURN TO FLEET</span>
        </Link>
      </div>
    )
  }

  const workId = listing.realsee_work_id || '80P29aOvr7kw98eDxE'

  const specs = [
    { label: 'TOTAL USABLE AREA', value: `${(listing.size_sqft || 10200).toLocaleString()} SQFT (947.6 M²)`, category: 'DIMENSIONS' },
    { label: 'INTERNAL VOLUME', value: '7,580 M³ (ESTIMATED)', category: 'DIMENSIONS' },
    { label: 'EAVES CLEAR HEIGHT', value: '8.50 METERS', category: 'CLEARANCE' },
    { label: 'APEX / TRUSS CLEARANCE', value: '7.20 METERS (LOWEST BEAM)', category: 'CLEARANCE' },
    { label: 'SLAB LOAD CAPACITY', value: '50 kN/M² (5,098 KG/M²)', category: 'STRUCTURAL' },
    { label: 'CONCRETE GRADE & DEPTH', value: 'C30 REINFORCED / 200 MM', category: 'STRUCTURAL' },
    { label: 'COLUMN BAY SPACING', value: '6.0 M × 12.0 M (CLEAR SPAN)', category: 'STRUCTURAL' },
    { label: 'ELECTRICAL POWER SUPPLY', value: '415V 3-PHASE / 200A (DEDICATED MDB)', category: 'UTILITIES' },
    { label: 'FIRE SUPPRESSION', value: 'ESFR SPRINKLER HEADS @ 6.80M DROP', category: 'UTILITIES' },
    { label: 'LOADING DOCKS & ACCESS', value: '1 MOTORIZED ROLLER SHUTTER (4.5M × 4.8M)', category: 'LOGISTICS' },
  ]

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* ─── Breadcrumbs & Navigation ────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ChevronLeft size={14} />
          <span>BACK TO PROPERTY FLEET</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            REALSEE ID: [{workId}]
          </span>
          <TierBadge tier="live" />
        </div>
      </div>

      {/* ─── Property Dossier Header & Audit Stamp ────────────────── */}
      <div
        className="hud-panel"
        style={{
          padding: '24px',
          marginBottom: '32px',
          borderColor: 'var(--border-medium)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
                COMMERCIAL DOSSIER • PROPERTY SPECIFICATION
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              {listing.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              📍 {listing.location}
            </p>
          </div>

          {/* Pricing & Commercial Terms */}
          <div
            style={{
              padding: '12px 20px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'right',
            }}
          >
            <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>BASE ASKING RENT</span>
            <div className="mono-metric" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
              KSh {listing.rent_ksh_per_sqft || 35} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ SQFT / MO</span>
            </div>
            <p style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
              SERVICE CHARGE: KSh {listing.service_charge_ksh_per_sqft || 8} / SQFT
            </p>
          </div>
        </div>

        {/* Verified Site Audit Badge */}
        <VerifiedBadge verification={verification} />
      </div>

      {/* ─── Technical Action Bar ──────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px',
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <Link href={`/listing/${id}/tour`} className="tech-btn-primary" style={{ padding: '12px 22px' }}>
          <Eye size={16} />
          <span>ENTER 3D SPATIAL TOUR →</span>
        </Link>
        <Link href={`/listing/${id}/clearance`} className="tech-btn-secondary" style={{ padding: '12px 18px' }}>
          <Ruler size={16} color="var(--accent-cyan)" />
          <span>OPEN CLEARANCE SIMULATOR</span>
        </Link>
        <Link href={`/listing/${id}/packet`} className="tech-btn-ghost" style={{ padding: '12px 18px', border: '1px solid var(--border-subtle)' }}>
          <Printer size={15} />
          <span>DOWNLOAD TECHNICAL PACKET (PDF)</span>
        </Link>
      </div>

      {/* ─── Split Layout: 3D Viewport (60%) + Specs Table (40%) ──── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '64px',
        }}
        className="grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Column (60%): Interactive 3D Spatial Viewport Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
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
                <span>ACTIVE 3D DIGITAL TWIN • REALSEE GALOIS VIEWPORT</span>
              </div>
              <Link
                href={`/listing/${id}/tour`}
                className="mono-metric"
                style={{ fontSize: '0.72rem', color: 'var(--accent-orange)', textDecoration: 'none' }}
              >
                FULLSCREEN →
              </Link>
            </div>

            <div style={{ flex: 1, position: 'relative', background: '#000000' }}>
              <iframe
                src={`https://realsee.ai/tour/${workId}?autoplay=0`}
                title="3D Tour Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="fullscreen; accelerometer; gyroscope; magnetometer; vr"
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <span>CAMERA ORIENTATION: 360° LiDAR</span>
            <span style={{ color: 'var(--accent-emerald)' }}>MESH RESOLUTION: HIGH (4K HDR)</span>
          </div>
        </div>

        {/* Right Column (40%): Structural Engineering Specification Table */}
        <div className="lg:col-span-5">
          <div className="hud-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="hud-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={14} color="var(--accent-orange)" />
                <span>STRUCTURAL ENGINEERING SPECIFICATION</span>
              </div>
              <span className="mono-metric" style={{ color: 'var(--text-muted)' }}>ISO 9001 / BS 8110</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="tech-spec-table">
                <thead>
                  <tr>
                    <th>PARAMETER</th>
                    <th style={{ textAlign: 'right' }}>ENGINEERING SPECIFICATION</th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((item) => (
                    <tr key={item.label}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {item.label}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Enterprise Roadmap Capabilities ──────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                ENTERPRISE EXTENSIONS
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              Future Capability Add-ons (Tier 3)
            </h2>
          </div>
          <TierBadge tier="coming-with-partnership" />
        </div>

        <Tier3PreviewCards listingId={id} />
      </section>
    </div>
  )
}
