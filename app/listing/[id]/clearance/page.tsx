'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { TierBadge } from '@/components/ui/TierBadge'
import {
  Ruler,
  ChevronLeft,
  Boxes,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Cpu,
  Building2,
  Layers,
} from 'lucide-react'
import type { EquipmentItem, EquipmentOption } from '@/components/clearance/WarehouseScene'

// Dynamic import to avoid SSR issues with Three.js
const WarehouseScene = dynamic(
  () => import('@/components/clearance/ThreeWarehouseScene').then((mod) => mod.ThreeWarehouseScene),
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
          borderRadius: 'var(--radius-xs)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--accent-orange)',
        }}
      >
        <span className="status-pulse-orange" style={{ marginRight: '8px' }} />
        INITIALIZING THREE.JS CAD VIEWPORT...
      </div>
    ),
  }
)

const FitCheckOverlay = dynamic(
  () => import('@/components/clearance/WarehouseScene').then((mod) => mod.FitCheckOverlay),
  { ssr: false }
)

const EquipmentPalette = dynamic(
  () => import('@/components/clearance/WarehouseScene').then((mod) => mod.EquipmentPalette),
  { ssr: false }
)

// Warehouse dimensions for the sample godown (in meters)
// 10,200 sqft ≈ ~947 m² → 30.0m × 31.5m, eave 8.5m, lowest beam 7.2m
const WAREHOUSE = {
  width: 30,
  length: 31.5,
  eaveHeight: 8.5,
  beamHeight: 7.2,
}

const DEFAULT_EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'eq-forklift-std',
    name: 'Counterbalance Forklift',
    dimensions: { length: 2.5, width: 1.2, height: 2.2 },
  },
  {
    id: 'eq-forklift-mast',
    name: 'Forklift (Mast Raised 4.8m)',
    dimensions: { length: 2.5, width: 1.2, height: 4.8 },
  },
  {
    id: 'eq-pallet-rack',
    name: '3-Tier Selective Pallet Rack',
    dimensions: { length: 2.7, width: 1.1, height: 6.0 },
  },
  {
    id: 'eq-container-40ft',
    name: '40ft High Cube Container',
    dimensions: { length: 12.2, width: 2.44, height: 2.89 },
  },
  {
    id: 'eq-reach-truck',
    name: 'High-Reach VNA Truck (7.6m)',
    dimensions: { length: 3.1, width: 1.4, height: 7.6 },
  },
]

const EQUIPMENT_COLORS = ['#F97316', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6']

export default function ClearancePage() {
  const params = useParams()
  const id = params.id as string
  const [placedEquipment, setPlacedEquipment] = useState<EquipmentItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handlePlace = useCallback(
    (option: EquipmentOption) => {
      const instanceId = `${option.id}-${Date.now()}`
      const fits = option.dimensions.height <= WAREHOUSE.beamHeight

      // Position within the warehouse boundaries
      const x = (Math.random() - 0.5) * (WAREHOUSE.width * 0.5)
      const z = (Math.random() - 0.5) * (WAREHOUSE.length * 0.5)
      const y = option.dimensions.height / 2

      const newItem: EquipmentItem = {
        id: instanceId,
        name: option.name,
        dimensions: option.dimensions,
        position: [x, y, z],
        color: EQUIPMENT_COLORS[placedEquipment.length % EQUIPMENT_COLORS.length],
        fits,
      }

      setPlacedEquipment((prev) => [...prev, newItem])
      setSelectedId(instanceId)
    },
    [placedEquipment.length]
  )

  const handleClear = () => {
    setPlacedEquipment([])
    setSelectedId(null)
  }

  return (
    <div className="route-shell" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
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
            3D Equipment Clearance & Fit Simulator
          </h1>
          <TierBadge tier="in-development" />
        </div>

        {placedEquipment.length > 0 && (
          <button
            onClick={handleClear}
            className="tech-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            <Trash2 size={13} />
            <span>CLEAR SCENE</span>
          </button>
        )}
      </div>

      {/* Main Simulation Layout Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '16px',
          height: 'calc(100vh - 240px)',
          minHeight: '580px',
        }}
        className="grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Toolbar / Asset Drawer */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
          <EquipmentPalette
            options={DEFAULT_EQUIPMENT_OPTIONS}
            onPlace={handlePlace}
            placedCount={placedEquipment.length}
          />

          <FitCheckOverlay
            equipment={placedEquipment}
            beamHeight={WAREHOUSE.beamHeight}
            onClear={handleClear}
          />

          {/* Warehouse Dimensional Envelope Card */}
          <div className="hud-panel" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Building2 size={14} color="var(--accent-cyan)" />
              <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
                STRUCTURAL BOUNDING BOX
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>WIDTH (X):</span>
                <p style={{ color: '#FFFFFF', fontWeight: 700 }}>{WAREHOUSE.width.toFixed(2)} m</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>LENGTH (Z):</span>
                <p style={{ color: '#FFFFFF', fontWeight: 700 }}>{WAREHOUSE.length.toFixed(2)} m</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>EAVE HEIGHT:</span>
                <p style={{ color: '#FFFFFF', fontWeight: 700 }}>{WAREHOUSE.eaveHeight.toFixed(2)} m</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>LOWEST TRUSS:</span>
                <p style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{WAREHOUSE.beamHeight.toFixed(2)} m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Three.js Interactive 3D Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <div
            className="hud-panel corner-brackets"
            style={{
              flex: 1,
              position: 'relative',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              background: '#060708',
            }}
          >
            {/* HUD Viewport Indicator */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '6px 10px',
                background: 'rgba(9, 11, 14, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              <span>ORBIT: LEFT-CLICK DRAG • ZOOM: SCROLL • PAN: RIGHT-CLICK</span>
            </div>

            <WarehouseScene
              warehouseWidth={WAREHOUSE.width}
              warehouseLength={WAREHOUSE.length}
              warehouseHeight={WAREHOUSE.eaveHeight}
              beamHeight={WAREHOUSE.beamHeight}
              equipment={placedEquipment}
              selectedId={selectedId}
              onSelectEquipment={setSelectedId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
