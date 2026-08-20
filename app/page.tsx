'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Boxes,
  Crosshair,
  Ruler,
  Zap,
  ShieldCheck,
  Building2,
  FileCode,
  Gauge,
  ArrowRight,
  Activity,
  Layers,
  Truck,
  Eye,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { TierBadge } from '@/components/ui/TierBadge'
import { SAMPLE_LISTING_ID } from '@/lib/data/mock-data'

export default function LandingPage() {
  const [activeCallout, setActiveCallout] = useState<string | null>('slab')

  const callouts = [
    {
      id: 'slab',
      label: 'SLAB LOAD CAPACITY',
      metric: '50 kN/m² (C30 Reinforced)',
      detail: '200mm thickness, vibration-tolerant to 25Hz. Heavy racking and machinery certified.',
      icon: Gauge,
      color: 'var(--accent-orange)',
      position: { top: '72%', left: '32%' },
    },
    {
      id: 'height',
      label: 'CLEAR HEIGHT UNDER TRUSS',
      metric: '11.85m Apex / 7.20m Beam',
      detail: 'Sprinkler head clearance at 6.80m. Supports standard 3-tier selective pallet racking.',
      icon: Ruler,
      color: 'var(--accent-emerald)',
      position: { top: '24%', left: '52%' },
    },
    {
      id: 'power',
      label: '3-PHASE POWER SUPPLY',
      metric: '415V / 200A (Expandable to 500 kVA)',
      detail: 'Dedicated distribution board with phase balance monitoring and surge suppression.',
      icon: Zap,
      color: 'var(--accent-amber)',
      position: { top: '48%', left: '16%' },
    },
    {
      id: 'logistics',
      label: 'TURNING & DOCK ACCESS',
      metric: '18.5m Articulated Radius',
      detail: '4.5m x 4.8m motorized roller shutter with 10,000kg hydraulic dock leveler.',
      icon: Truck,
      color: 'var(--accent-cyan)',
      position: { top: '64%', left: '78%' },
    },
  ]

  const capabilityTiers = [
    {
      tier: 'live' as const,
      name: 'TIER 1: SPATIAL TWIN & SECURE EMBED',
      status: 'OPERATIONAL NOW',
      description: 'Zero-latency 3D mesh exploration with complete server-side token isolation.',
      items: [
        '360° LiDAR Photogrammetry Digital Twin',
        'Multi-axis Dollhouse & Floor Plan Navigation',
        'Server-Side API Proxying (Zero Browser Key Leaks)',
        'Full WebGL / Three.js Viewport Integration',
      ],
      ctaText: 'LAUNCH LIVE 3D TOUR',
      ctaHref: `/listing/${SAMPLE_LISTING_ID}/tour`,
      accent: 'var(--accent-emerald)',
    },
    {
      tier: 'in-development' as const,
      name: 'TIER 2: STRUCTURAL INTELLIGENCE & SIMULATION',
      status: 'CURRENT BUILD',
      description: 'Engineering data layers embedded directly into the spatial model with 3D clearance testing.',
      items: [
        'Interactive Structural Hotspots (Floor, Height, Power, Docks)',
        '3D Equipment Clearance Simulator (Forklifts & Racks)',
        'Verified-Capture On-Site LiDAR Audit Stamp',
        'Dimensional Bounding Box & Fit/No-Fit Math',
      ],
      ctaText: 'TEST CLEARANCE SANDBOX',
      ctaHref: `/listing/${SAMPLE_LISTING_ID}/clearance`,
      accent: 'var(--accent-amber)',
    },
    {
      tier: 'coming-with-partnership' as const,
      name: 'TIER 3: ENTERPRISE CAD & BIM ROADMAP',
      status: 'ROADMAP VISION',
      description: 'Collaborative live sessions and deep CAD/AEC format interoperability.',
      items: [
        'Scan-to-BIM Export (Revit .RVT, IFC, 2D DWG)',
        'Multi-Tenant Synchronized Live Co-Viewing with Audio',
        '1-Click AEC Certified Property Technical PDF Dossier',
        'Enterprise Portfolio Fleet Management',
      ],
      ctaText: 'PREVIEW TECH PACKET',
      ctaHref: `/listing/${SAMPLE_LISTING_ID}/packet`,
      accent: 'var(--accent-cyan)',
    },
  ]

  const featuredListings = [
    {
      id: SAMPLE_LISTING_ID,
      title: 'Godown Unit A3 — Industrial Area Corridor',
      location: 'Off Mombasa Road, Industrial Area, Nairobi',
      sqft: '10,200 sqft (947 m²)',
      rent: 'KSh 35 / sqft',
      eaveHeight: '8.50m (7.20m Truss)',
      slabCapacity: '50 kN/m² (C30)',
      gridSpacing: '6.0m x 12.0m',
      power: '200A 3-Phase',
      status: 'VERIFIED ON-SITE',
    },
  ]

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section style={{ marginBottom: '64px' }}>
        {/* Status HUD Header Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '28px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="status-pulse-emerald" style={{ width: '6px', height: '6px' }} />
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>[SYSTEM: OPERATIONAL]</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span>PHOTOGRAMMETRY PIPELINE ONLINE</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ color: 'var(--accent-orange)' }}>SPATIAL TWIN ACTIVE</span>
        </div>

        {/* Hero Title & Subheadline */}
        <div style={{ maxWidth: '960px', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}
          >
            Spatial Intelligence for Commercial Real Estate & Industrial Parks.
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '780px',
            }}
          >
            Stop guessing clear heights and floor loads from flat 2D photos. Reallogic delivers millimeter-accurate
            3D digital twins with embedded structural engineering data, forklift clearance simulations, and verifiable
            on-site audit trails.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <Link href={`/listing/${SAMPLE_LISTING_ID}`} className="tech-btn-primary" style={{ padding: '12px 24px', fontSize: '0.88rem' }}>
            <span>LAUNCH SPATIAL INSPECTION</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#capability-matrix" className="tech-btn-secondary" style={{ padding: '12px 20px', fontSize: '0.85rem' }}>
            <span>VIEW CAPABILITY MATRIX</span>
          </a>
        </div>

        {/* ─── Interactive Isometric 3D Warehouse Cross-Section ──── */}
        <div
          className="hud-panel corner-brackets"
          style={{
            position: 'relative',
            height: '480px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '1px solid var(--border-strong)',
            background: '#eef4fb',
          }}
        >
          {/* Header Bar */}
          <div className="hud-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={14} color="var(--accent-orange)" />
              <span>ISOMETRIC SPATIAL CROSS-SECTION • 10,200 SQFT GODOWN SCHEMATIC</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>SCALE: 1:100</span>
              <span style={{ color: 'var(--accent-cyan)' }}>COORDINATES: [-1.3197, 36.8524]</span>
            </div>
          </div>

          {/* Grid canvas background */}
          <div
            className="bg-cad-grid"
            style={{
              position: 'absolute',
              inset: 0,
              top: '38px',
              opacity: 0.8,
            }}
          />

          {/* Schematic SVG Vector Blueprint */}
          <svg
            viewBox="0 0 1000 500"
            style={{
              position: 'absolute',
              inset: 0,
              top: '38px',
              width: '100%',
              height: 'calc(100% - 38px)',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <linearGradient id="wireframe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="floor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#202836" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#090B0E" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Warehouse Floor Isometric Polygon */}
            <polygon points="120,360 500,450 880,360 500,270" fill="url(#floor-grad)" stroke="#374354" strokeWidth="1.5" />
            
            {/* Columns & Roof Truss Grid */}
            <line x1="120" y1="360" x2="120" y2="140" stroke="#4B5563" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="500" y1="450" x2="500" y2="230" stroke="#F97316" strokeWidth="2" />
            <line x1="880" y1="360" x2="880" y2="140" stroke="#4B5563" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="500" y1="270" x2="500" y2="60" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Roof Truss Angles */}
            <line x1="120" y1="140" x2="500" y2="60" stroke="#F97316" strokeWidth="2" />
            <line x1="500" y1="60" x2="880" y2="140" stroke="#F97316" strokeWidth="2" />
            <line x1="120" y1="140" x2="500" y2="230" stroke="#374354" strokeWidth="1.5" />
            <line x1="500" y1="230" x2="880" y2="140" stroke="#374354" strokeWidth="1.5" />

            {/* Internal Structural Grids (Bay divisions) */}
            <line x1="280" y1="395" x2="280" y2="180" stroke="#27313F" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="690" y1="405" x2="690" y2="185" stroke="#27313F" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="310" y1="315" x2="690" y2="405" stroke="#06B6D4" strokeWidth="1" opacity="0.4" />
          </svg>

          {/* Interactive Spatial Callout Pins */}
          {callouts.map((callout) => {
            const Icon = callout.icon
            const isSelected = activeCallout === callout.id
            return (
              <div
                key={callout.id}
                onClick={() => setActiveCallout(callout.id)}
                style={{
                  position: 'absolute',
                  top: callout.position.top,
                  left: callout.position.left,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : 20,
                }}
              >
                {/* Visual Pin Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: isSelected ? 'var(--bg-void)' : 'rgba(14, 18, 23, 0.92)',
                    border: `1px solid ${isSelected ? callout.color : 'var(--border-strong)'}`,
                    borderRadius: 'var(--radius-xs)',
                    boxShadow: isSelected ? `0 0 20px ${callout.color}40` : '0 4px 12px rgba(0,0,0,0.5)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <Icon size={14} color={callout.color} />
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    [{callout.metric}]
                  </span>
                </div>
              </div>
            )
          })}

          {/* Active Callout Inspector Overlay Card */}
          {activeCallout && (() => {
            const current = callouts.find((c) => c.id === activeCallout)
            if (!current) return null
            const CurrentIcon = current.icon
            return (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  maxWidth: '480px',
                  background: 'rgba(10, 13, 17, 0.95)',
                  border: `1px solid ${current.color}`,
                  borderRadius: 'var(--radius-xs)',
                  padding: '16px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(12px)',
                  zIndex: 40,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CurrentIcon size={16} color={current.color} />
                    <span className="mono-tag" style={{ color: current.color }}>
                      {current.label}
                    </span>
                  </div>
                  <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    TELEMETRY VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {current.metric}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {current.detail}
                </p>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ─── Three Tiers Engineering Capability Matrix ─────────────── */}
      <section id="capability-matrix" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Layers size={16} color="var(--accent-orange)" />
              <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
                ARCHITECTURE FRAMEWORK
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '1.8rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Three-Tier Engineering Capability Matrix
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px' }}>
            Built modularly via adapter interfaces. Each tier provides clear demarcation between active operational tooling and enterprise roadmap capabilities.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px',
          }}
        >
          {capabilityTiers.map((tier) => (
            <div
              key={tier.name}
              className="hud-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: tier.tier === 'live' ? 'var(--border-emerald)' : tier.tier === 'in-development' ? 'var(--border-accent)' : 'var(--border-medium)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <TierBadge tier={tier.tier} size="md" />
                  <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    [{tier.status}]
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {tier.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {tier.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginBottom: '24px' }}>
                  <p className="mono-tag" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                    KEY DELIVERABLES:
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tier.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <CheckCircle2 size={14} color={tier.accent} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={tier.ctaHref}
                className={tier.tier === 'live' ? 'tech-btn-primary' : 'tech-btn-secondary'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Industrial Property Fleet Grid ───────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Building2 size={16} color="var(--accent-orange)" />
              <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
                VERIFIED PROPERTY FLEET
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '1.6rem',
                color: 'var(--text-primary)',
              }}
            >
              Featured Warehouse Listings
            </h2>
          </div>
          <span className="mono-metric" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            1 ACTIVE SPATIAL TWIN
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {featuredListings.map((listing) => (
            <div
              key={listing.id}
              className="hud-panel"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <TierBadge tier="live" />
                  <span
                    className="mono-metric"
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--accent-emerald)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {listing.status}
                  </span>
                </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {listing.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  📍 {listing.location}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/listing/${listing.id}`} className="tech-btn-primary">
                    <span>DOSSIER SPECIFICATIONS</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link href={`/listing/${listing.id}/tour`} className="tech-btn-secondary">
                    <Eye size={14} />
                    <span>3D TOUR</span>
                  </Link>
                </div>
              </div>

              {/* Technical Metrics Table */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>USABLE AREA</span>
                    <p className="mono-metric" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {listing.sqft}
                    </p>
                  </div>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>RENTAL RATE</span>
                    <p className="mono-metric" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                      {listing.rent}
                    </p>
                  </div>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>CLEAR HEIGHT</span>
                    <p className="mono-metric" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {listing.eaveHeight}
                    </p>
                  </div>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>SLAB CAPACITY</span>
                    <p className="mono-metric" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {listing.slabCapacity}
                    </p>
                  </div>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>BAY GRID</span>
                    <p className="mono-metric" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {listing.gridSpacing}
                    </p>
                  </div>
                  <div>
                    <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>POWER SUPPLY</span>
                    <p className="mono-metric" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {listing.power}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
