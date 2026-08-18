'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Eye,
  Crosshair,
  Ruler,
  Layers,
  ChevronLeft,
  ShieldCheck,
  Maximize2,
  Compass,
  Zap,
  Truck,
  Gauge,
  Info,
} from 'lucide-react'
import { PanoramaViewer } from '@/components/tour/PanoramaViewer'
import { HotspotMarker } from '@/components/tour/HotspotMarker'
import { HotspotInfoCard } from '@/components/tour/HotspotInfoCard'
import { TierBadge } from '@/components/ui/TierBadge'
import { getListing, getHotspots } from '@/lib/data'
import type { Listing, Hotspot } from '@/lib/realsee/types'

// Map 3D scene positions to 2D overlay percentages for the demo
function scenePositionToOverlay(pos: { x: number; y: number; z: number }) {
  const x = ((pos.x + 6) / 12) * 100
  const y = ((4 - pos.y) / 5) * 100
  return {
    x: Math.max(8, Math.min(92, x)),
    y: Math.max(12, Math.min(88, y)),
  }
}

export default function TourPage() {
  const params = useParams()
  const id = params.id as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
  const [viewMode, setViewMode] = useState<'3d-realsee' | 'hotspots'>('3d-realsee')
  const [activeFloorLayer, setActiveFloorLayer] = useState<'ground' | 'mezzanine' | 'truss'>('ground')
  const [measurementActive, setMeasurementActive] = useState(false)

  useEffect(() => {
    getListing(id).then(setListing)
    getHotspots(id).then(setHotspots)
  }, [id])

  const workId = listing?.realsee_work_id || 'nmRVg9JX4Cl62XiXmP'
  const panoramaUrl = '/mock/pano-warehouse-main.jpg'

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      {/* ─── Top Telemetry Header ─────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
          <div style={{ height: '16px', width: '1px', background: 'var(--border-medium)' }} />
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF' }}>
            3D Spatial Inspection HUD
          </h1>
          <TierBadge tier="live" />
        </div>

        {/* View Mode Toggle Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              padding: '3px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-medium)',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setViewMode('3d-realsee')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === '3d-realsee' ? 'var(--accent-orange)' : 'transparent',
                color: viewMode === '3d-realsee' ? '#000000' : 'var(--text-secondary)',
                transition: 'all 120ms ease',
              }}
            >
              <Eye size={13} />
              <span>REALSEE 3D TOUR</span>
            </button>
            <button
              onClick={() => setViewMode('hotspots')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'hotspots' ? 'var(--accent-orange)' : 'transparent',
                color: viewMode === 'hotspots' ? '#000000' : 'var(--text-secondary)',
                transition: 'all 120ms ease',
              }}
            >
              <Crosshair size={13} />
              <span>ENGINEERING HOTSPOTS</span>
            </button>
          </div>

          <TierBadge tier="in-development" />
        </div>
      </div>

      {/* ─── CAD HUD Toolbar ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderBottom: 'none',
          borderRadius: 'var(--radius-xs) var(--radius-xs) 0 0',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF' }}>
            <Compass size={13} color="var(--accent-orange)" />
            ORIENTATION: TRUE NORTH [0.0°]
          </span>
          <span className="hidden sm:inline" style={{ color: 'var(--border-strong)' }}>|</span>
          <span className="hidden sm:inline">WORK ID: [{workId}]</span>
        </div>

        {/* Floor Layer Filter & Measurement Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={13} color="var(--accent-cyan)" />
            <span>LAYER:</span>
            <select
              value={activeFloorLayer}
              onChange={(e) => setActiveFloorLayer(e.target.value as any)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                outline: 'none',
              }}
            >
              <option value="ground">GROUND SLAB (0.0m)</option>
              <option value="mezzanine">MEZZANINE DECK (+3.5m)</option>
              <option value="truss">ROOF TRUSS GRID (+7.2m)</option>
            </select>
          </div>

          <button
            onClick={() => setMeasurementActive(!measurementActive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              background: measurementActive ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)',
              border: `1px solid ${measurementActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-xs)',
              color: measurementActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            <Ruler size={12} />
            <span>MEASURE (±5mm)</span>
          </button>
        </div>
      </div>

      {/* ─── Main 3D Spatial Canvas ───────────────────────────────── */}
      <div
        className="hud-panel"
        style={{
          position: 'relative',
          height: 'calc(100vh - 280px)',
          minHeight: '560px',
          borderRadius: '0 0 var(--radius-xs) var(--radius-xs)',
          overflow: 'hidden',
          border: '1px solid var(--border-medium)',
          background: '#000000',
        }}
      >
        {viewMode === '3d-realsee' ? (
          <iframe
            src={`https://realsee.ai/tour/${workId}?autoplay=0`}
            title="Realsee 3D Spatial Walkthrough"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allow="fullscreen; accelerometer; gyroscope; magnetometer; vr"
            allowFullScreen
          />
        ) : (
          <PanoramaViewer imageUrl={panoramaUrl}>
            {/* Hotspot Markers Overlaid in 3D Scene */}
            {hotspots.map((hotspot) => {
              const pos = scenePositionToOverlay(hotspot.position)
              return (
                <HotspotMarker
                  key={hotspot.id}
                  category={hotspot.category}
                  label={hotspot.label}
                  x={pos.x}
                  y={pos.y}
                  isActive={activeHotspot?.id === hotspot.id}
                  onClick={() =>
                    setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot)
                  }
                />
              )
            })}
          </PanoramaViewer>
        )}

        {/* Measurement Reticle Overlay (if enabled) */}
        {measurementActive && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '10px 14px',
              background: 'rgba(9, 11, 14, 0.95)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#FFFFFF',
              zIndex: 40,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              <Crosshair size={14} />
              <span style={{ fontWeight: 700 }}>IN-VIEWER CAD MEASURE</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              Click two points in 3D scene to calculate millimeter distance.
            </p>
          </div>
        )}

        {/* Active Hotspot Inspector Card */}
        {viewMode === 'hotspots' && activeHotspot && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 50,
            }}
          >
            <HotspotInfoCard
              hotspot={activeHotspot}
              onClose={() => setActiveHotspot(null)}
            />
          </div>
        )}
      </div>

      {/* ─── Hotspot Category Legend HUD ──────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginTop: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        {[
          { label: 'FLOOR SLAB (50 kN/m²)', color: 'var(--accent-orange)', icon: Gauge },
          { label: 'CLEAR HEIGHT (11.85m APEX)', color: 'var(--accent-emerald)', icon: Ruler },
          { label: '3-PHASE POWER (415V/200A)', color: 'var(--accent-amber)', icon: Zap },
          { label: 'LOGISTICS & DOCK ACCESS', color: 'var(--accent-cyan)', icon: Truck },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '1px',
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}`,
                }}
              />
              <Icon size={12} color={item.color} />
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
