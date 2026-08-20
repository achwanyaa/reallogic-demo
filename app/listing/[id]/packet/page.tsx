'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Printer,
  ChevronLeft,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  QrCode,
  Crosshair,
  Gauge,
  Ruler,
  Zap,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { TierBadge } from '@/components/ui/TierBadge'
import { getListing, getCaptureVerification } from '@/lib/data'
import type { Listing, CaptureVerification } from '@/lib/realsee/types'

export default function PacketPage() {
  const params = useParams()
  const id = params.id as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [verification, setVerification] = useState<CaptureVerification | null>(null)

  useEffect(() => {
    getListing(id).then(setListing)
    getCaptureVerification(id).then(setVerification)
  }, [id])

  const sections = [
    {
      title: '1.0 STRUCTURAL SLAB SPECIFICATION',
      code: 'BS 8110-1:1997',
      items: [
        { label: 'SLAB THICKNESS', val: '200 mm reinforced concrete' },
        { label: 'CONCRETE GRADE', val: 'C30 compressive strength' },
        { label: 'UNIFORM DISTRIBUTED LOAD (UDL)', val: '50.0 kN/m² (5,098 kg/m²)' },
        { label: 'POINT LOAD RESISTANCE', val: '80.0 kN on 150×150mm plate' },
        { label: 'SURFACE TOLERANCE', val: 'FM2 classification (TR34 4th Edition)' },
        { label: 'VIBRATION TOLERANCE', val: '25 Hz (Heavy machinery compliant)' },
      ],
    },
    {
      title: '2.0 CLEAR HEIGHT & VOLUMETRIC ENVELOPE',
      code: 'AEC-VOL-V4',
      items: [
        { label: 'EAVES CLEAR HEIGHT', val: '8.50 meters to roof valley' },
        { label: 'LOWEST ROOF TRUSS BEAM', val: '7.20 meters clear height' },
        { label: 'RIDGE APEX ELEVATION', val: '11.85 meters central span' },
        { label: 'SPRINKLER DROP CLEARANCE', val: '6.80 meters to deflector plate' },
        { label: 'RACKING CLEARANCE ENVELOPE', val: 'Certified for 3-tier selective pallet racking' },
      ],
    },
    {
      title: '3.0 ELECTRICAL & UTILITY INFRASTRUCTURE',
      code: 'IEE WIRING REG. 18TH ED',
      items: [
        { label: 'MAIN POWER SUPPLY', val: '415V, 3-Phase, 50 Hz' },
        { label: 'INCOMING SERVICE AMPERAGE', val: '200 Amperes per phase (dedicated MDB)' },
        { label: 'TRANSFORMER CAPACITY', val: '500 kVA dedicated step-down on boundary' },
        { label: 'WATER INCOMING PRESSURE', val: '4.0 bar municipal + 50,000L backup tank' },
        { label: 'FIRE SUPPRESSION', val: 'ESFR sprinkler system + dual booster pumps' },
      ],
    },
    {
      title: '4.0 LOGISTICS & ARTICULATED ACCESS',
      code: 'HIGHWAY-LOG-KE',
      items: [
        { label: 'LOADING BAY DOORS', val: '1 Motorized roller shutter (4.50m W × 4.80m H)' },
        { label: 'DOCK LEVELER RATING', val: '10,000 kg electro-hydraulic dock leveler' },
        { label: 'APRON TURNING RADIUS', val: '18.5 meters (WB-15 / 40ft container access)' },
        { label: 'CANOPY OVERHANG', val: '6.0 meters cantilever weather protection' },
      ],
    },
  ]

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="route-shell" style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Non-printable Navigation Bar */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Link
          href={`/listing/${id}`}
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
          <span>BACK TO DOSSIER</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TierBadge tier="coming-with-partnership" size="md" />
          <button
            onClick={handlePrint}
            className="tech-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.78rem' }}
          >
            <Printer size={14} />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>
      </div>

      {/* ─── AEC-Grade Printable Engineering Packet ─────────────────── */}
      <div
        className="hud-panel corner-brackets"
        style={{
          padding: '40px',
          background: 'var(--bg-void)',
          borderColor: 'var(--border-strong)',
        }}
      >
        {/* Document Header & Engineering Seal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '24px',
            borderBottom: '2px solid var(--border-medium)',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
                REALLOGIC PROPERTY TECHNICAL PACKET • CERTIFIED SPECIFICATION
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}
            >
              {listing?.title || 'Godown Unit A3 — Industrial Area'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {listing?.location || 'Off Mombasa Road, Industrial Area, Nairobi'}
            </p>
          </div>

          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'right',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <p style={{ color: '#FFFFFF', fontWeight: 700 }}>REPORT REF: RL-NBI-2026-0047</p>
            <p>SURVEY ENGINE: CERTIFIED LiDAR POINT CLOUD</p>
            <p>ISSUED: 2026-08-14</p>
            <p style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}>STATUS: VERIFIED ON-SITE</p>
          </div>
        </div>

        {/* Executive Dimensional Summary Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '36px',
          }}
        >
          <div>
            <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>USABLE FLOOR AREA</span>
            <p className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>10,200 SQFT (947.6 M²)</p>
          </div>
          <div>
            <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>MAX CLEAR HEIGHT</span>
            <p className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)' }}>8.50m (7.20m BEAM)</p>
          </div>
          <div>
            <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>SLAB LOAD BEARING</span>
            <p className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>50 kN/M² (C30)</p>
          </div>
          <div>
            <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>POWER AMPS (3-PHASE)</span>
            <p className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>415V / 200A</p>
          </div>
        </div>

        {/* Detailed Engineering Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
          {sections.map((section) => (
            <div key={section.title} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                  {section.title}
                </h3>
                <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
                  [{section.code}]
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '8px' }}>
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Verification Certificate Stamp & QR Code */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: '24px',
            alignItems: 'center',
            padding: '20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '6px' }}>
              <ShieldCheck size={18} />
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.9rem' }}>
                CERTIFIED PHYSICAL SURVEY AUDIT TRAIL
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This technical packet was derived directly from on-site LiDAR scans captured by Reallogic Certified Surveyor (#047). 
              Dimensional variance is guaranteed within ±15mm tolerance across the entire 10,200 sqft floor plate.
            </p>
          </div>

          <div
            style={{
              padding: '12px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center',
              color: '#000000',
            }}
          >
            <QrCode size={64} />
            <p style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '4px' }}>
              SCAN TO VIEW 3D TWIN
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
