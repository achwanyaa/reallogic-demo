'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Boxes,
  Crosshair,
  Ruler,
  ShieldCheck,
  ChevronLeft,
  Terminal,
  Database,
  Building2,
  Cpu,
} from 'lucide-react'
import { getAllListings, getHotspots, getEquipmentModels, getCaptureVerification } from '@/lib/data'
import type { Listing, Hotspot, EquipmentModel, CaptureVerification } from '@/lib/realsee/types'

type Tab = 'listings' | 'hotspots' | 'equipment' | 'verification'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('listings')
  const [listings, setListings] = useState<Listing[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [equipment, setEquipment] = useState<EquipmentModel[]>([])
  const [verification, setVerification] = useState<CaptureVerification | null>(null)

  useEffect(() => {
    getAllListings().then(setListings)
    getEquipmentModels().then(setEquipment)
  }, [])

  useEffect(() => {
    if (listings.length > 0) {
      getHotspots(listings[0].id).then(setHotspots)
      getCaptureVerification(listings[0].id).then(setVerification)
    }
  }, [listings])

  const tabs: { key: Tab; label: string; count: number; icon: any }[] = [
    { key: 'listings', label: 'PROPERTY FLEET', count: listings.length, icon: Building2 },
    { key: 'hotspots', label: 'STRUCTURAL HOTSPOTS', count: hotspots.length, icon: Crosshair },
    { key: 'equipment', label: 'EQUIPMENT MODELS', count: equipment.length, icon: Boxes },
    { key: 'verification', label: 'AUDIT VERIFICATION', count: verification ? 1 : 0, icon: ShieldCheck },
  ]

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            <span>HOME</span>
          </Link>
          <div style={{ height: '16px', width: '1px', background: 'var(--border-medium)' }} />
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.4rem', color: '#FFFFFF' }}>
            System Data & Telemetry Console
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
            [SUPABASE / LOCAL ADAPTER: ACTIVE]
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div
        className="hud-panel"
        style={{
          padding: '12px 16px',
          marginBottom: '28px',
          borderLeft: '3px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Database size={16} color="var(--accent-cyan)" />
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          READ-ONLY TELEMETRY CONSOLE • Changes made to Supabase or localized schema sync automatically with the Five SDK adapter.
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-medium)',
          paddingBottom: '0',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                border: '1px solid transparent',
                borderBottom: isActive ? '2px solid var(--accent-orange)' : '2px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} color={isActive ? 'var(--accent-orange)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: '2px',
                  background: 'var(--bg-secondary)',
                  color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                  fontSize: '0.68rem',
                }}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'listings' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {listings.map((listing) => (
            <div key={listing.id} className="hud-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF' }}>{listing.title}</h3>
                <Link
                  href={`/listing/${listing.id}`}
                  className="tech-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                >
                  VIEW DOSSIER →
                </Link>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                📍 {listing.location}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                }}
              >
                <span>ID: {listing.id}</span>
                <span>AREA: {listing.size_sqft?.toLocaleString()} SQFT</span>
                <span>RATE: KSH {listing.rent_ksh_per_sqft}/SQFT</span>
                <span>WORK_ID: [{listing.realsee_work_id || 'LOCAL'}]</span>
                <span style={{ color: 'var(--accent-emerald)' }}>TIER: {listing.tier?.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'hotspots' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className="hud-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>{hotspot.label}</h3>
                <span className="mono-metric" style={{ fontSize: '0.7rem', color: 'var(--accent-orange)' }}>
                  [{hotspot.category.toUpperCase()}]
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                POSITION VECTOR: ({hotspot.position.x}, {hotspot.position.y}, {hotspot.position.z})
              </p>
              <pre
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(hotspot.values, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'equipment' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {equipment.map((eq) => (
            <div key={eq.id} className="hud-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '6px' }}>{eq.name}</h3>
              <p className="mono-metric" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                {eq.dimensions_m.length}m (L) × {eq.dimensions_m.width}m (W) × {eq.dimensions_m.height}m (H)
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                GLB ASSET: {eq.glb_url}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'verification' && verification && (
        <div className="hud-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Capture Verification Record</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>CAPTURE TYPE</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.capture_type?.toUpperCase()}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>OPERATOR ID</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.operator_id}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>TIMESTAMP</span>
              <p style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{verification.captured_at ? new Date(verification.captured_at).toISOString() : '—'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>LINKED LISTING</span>
              <p style={{ color: 'var(--accent-orange)', marginTop: '2px' }}>{verification.listing_id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
