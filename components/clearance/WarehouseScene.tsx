'use client'

import { useState } from 'react'
import { Boxes, AlertTriangle, CheckCircle2, Ruler, Trash2 } from 'lucide-react'

export interface EquipmentItem {
  id: string
  name: string
  dimensions: { length: number; width: number; height: number }
  position: [number, number, number]
  color: string
  fits: boolean
}

export interface EquipmentOption {
  id: string
  name: string
  dimensions: { length: number; width: number; height: number }
  description?: string
}

// ─── Isometric CSS Warehouse Scene ───────────────────────────────────────────
// Pure CSS/SVG isometric 2.5D view — no Three.js dependency needed.

interface WarehouseSceneProps {
  warehouseWidth: number
  warehouseLength: number
  warehouseHeight: number
  beamHeight: number
  equipment: EquipmentItem[]
  selectedId: string | null
  onSelectEquipment: (id: string | null) => void
}

// Scale: 1m = 8px for the floor plan, height bars use a side ruler scale
const FLOOR_SCALE = 8 // px per meter
const HEIGHT_SCALE = 10 // px per meter

// Transform floor (x, z) to isometric screen coords
function iso(x: number, z: number): [number, number] {
  const TILE = FLOOR_SCALE
  const screenX = (x - z) * TILE * 0.707
  const screenY = (x + z) * TILE * 0.4
  return [screenX, screenY]
}

export function WarehouseScene({
  warehouseWidth,
  warehouseLength,
  warehouseHeight,
  beamHeight,
  equipment,
  selectedId,
  onSelectEquipment,
}: WarehouseSceneProps) {
  // Grid line SVG paths
  const w = warehouseWidth
  const l = warehouseLength
  const [cx, cy] = iso(w / 2, l / 2)

  const CANVAS_W = 820
  const CANVAS_H = 440
  const OX = CANVAS_W / 2  // origin offset for centering
  const OY = 60

  function p(x: number, z: number) {
    const [sx, sy] = iso(x, z)
    return `${sx + OX},${sy + OY}`
  }

  // Warehouse floor outline (isometric quad)
  const floorPath = `M ${p(0, 0)} L ${p(w, 0)} L ${p(w, l)} L ${p(0, l)} Z`

  // Grid lines
  const gridLines: string[] = []
  for (let xi = 0; xi <= w; xi += 5) {
    gridLines.push(`M ${p(xi, 0)} L ${p(xi, l)}`)
  }
  for (let zi = 0; zi <= l; zi += 5) {
    gridLines.push(`M ${p(0, zi)} L ${p(w, zi)}`)
  }

  // Height column on left edge
  const colX = -4.5
  const colZ = 0

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#060708',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
      onClick={() => onSelectEquipment(null)}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Floor slab */}
        <path d={floorPath} fill="#0B0E13" stroke="#27313F" strokeWidth="1.5" />

        {/* Grid lines */}
        {gridLines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1C232D" strokeWidth={0.5} />
        ))}

        {/* Warehouse left wall (isometric left face) */}
        {(() => {
          const hPx = warehouseHeight * HEIGHT_SCALE
          const wallPath = [
            `M ${p(0, 0)}`,
            `L ${p(0, 0).split(',')[0]},${parseFloat(p(0, 0).split(',')[1]) - hPx}`,
            `L ${p(0, l).split(',')[0]},${parseFloat(p(0, l).split(',')[1]) - hPx}`,
            `L ${p(0, l)}`,
            'Z'
          ].join(' ')
          return <path d={wallPath} fill="#0E121A" stroke="#27313F" strokeWidth="1" />
        })()}

        {/* Warehouse right wall (isometric right face) */}
        {(() => {
          const hPx = warehouseHeight * HEIGHT_SCALE
          const wallPath = [
            `M ${p(w, 0)}`,
            `L ${p(w, 0).split(',')[0]},${parseFloat(p(w, 0).split(',')[1]) - hPx}`,
            `L ${p(0, 0).split(',')[0]},${parseFloat(p(0, 0).split(',')[1]) - hPx}`,
            `L ${p(0, 0)}`,
            'Z'
          ].join(' ')
          return <path d={wallPath} fill="#0F1318" stroke="#27313F" strokeWidth="1" />
        })()}

        {/* Eave roof outline */}
        {(() => {
          const hPx = warehouseHeight * HEIGHT_SCALE
          const roofPath = [
            `M ${p(0, 0).split(',')[0]},${parseFloat(p(0, 0).split(',')[1]) - hPx}`,
            `L ${p(w, 0).split(',')[0]},${parseFloat(p(w, 0).split(',')[1]) - hPx}`,
          ].join(' ')
          return <path d={roofPath} fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="4 2" />
        })()}

        {/* Beam clearance line */}
        {(() => {
          const hPx = beamHeight * HEIGHT_SCALE
          const beamPath = [
            `M ${p(0, 0).split(',')[0]},${parseFloat(p(0, 0).split(',')[1]) - hPx}`,
            `L ${p(w, 0).split(',')[0]},${parseFloat(p(w, 0).split(',')[1]) - hPx}`,
          ].join(' ')
          return <path d={beamPath} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
        })()}

        {/* Equipment footprints on floor */}
        {equipment.map((item) => {
          const [ex, , ez] = item.position
          const el = item.dimensions.length
          const ew = item.dimensions.width
          const eh = item.dimensions.height
          const color = item.fits ? item.color : '#F43F5E'
          const isSelected = selectedId === item.id
          const hPx = eh * HEIGHT_SCALE

          // Floor quad
          const eq = [
            `M ${p(ex, ez)}`,
            `L ${p(ex + el, ez)}`,
            `L ${p(ex + el, ez + ew)}`,
            `L ${p(ex, ez + ew)}`,
            'Z',
          ].join(' ')

          // Height box (just front-left face going up)
          const topLeft = p(ex, ez)
          const [tlx, tly] = topLeft.split(',').map(Number)
          const topPath = [
            `M ${tlx},${tly}`,
            `L ${tlx},${tly - hPx}`,
            `L ${p(ex + el, ez).split(',')[0]},${parseFloat(p(ex + el, ez).split(',')[1]) - hPx}`,
            `L ${p(ex + el, ez)}`,
          ].join(' ')

          return (
            <g
              key={item.id}
              onClick={(e) => { e.stopPropagation(); onSelectEquipment(item.id) }}
              style={{ cursor: 'pointer' }}
            >
              {/* Height pillar */}
              <path
                d={topPath}
                fill={color}
                fillOpacity={isSelected ? 0.5 : 0.3}
                stroke={color}
                strokeWidth={isSelected ? 1.5 : 1}
              />
              {/* Floor footprint */}
              <path
                d={eq}
                fill={color}
                fillOpacity={isSelected ? 0.7 : 0.5}
                stroke={color}
                strokeWidth={isSelected ? 2 : 1}
              />
              {/* Item label */}
              <text
                x={parseFloat(p(ex + el / 2, ez + ew / 2).split(',')[0])}
                y={parseFloat(p(ex + el / 2, ez + ew / 2).split(',')[1]) - hPx - 6}
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#FFFFFF"
                style={{ pointerEvents: 'none' }}
              >
                {item.name} ({eh}m)
              </text>
            </g>
          )
        })}

        {/* Height ruler on left edge */}
        {[0, 2, 4, 6, beamHeight, warehouseHeight].map((h) => {
          const hPx = h * HEIGHT_SCALE
          const [lx, ly] = p(0, 0).split(',').map(Number)
          const y = ly - hPx
          const isBeam = h === beamHeight
          const isEave = h === warehouseHeight
          return (
            <g key={h}>
              <line x1={lx - 20} y1={y} x2={lx} y2={y} stroke={isBeam ? '#F59E0B' : isEave ? '#34D399' : '#3A4252'} strokeWidth={1} />
              <text
                x={lx - 24}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                fontFamily="monospace"
                fill={isBeam ? '#F59E0B' : isEave ? '#34D399' : '#606774'}
              >
                {h}m
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <g transform={`translate(${CANVAS_W - 140}, 12)`}>
          <rect x={0} y={0} width={132} height={58} rx={3} fill="#0A0D12" stroke="#27313F" />
          <line x1={8} y1={16} x2={30} y2={16} stroke="#34D399" strokeWidth="2" strokeDasharray="4 2" />
          <text x={36} y={20} fontSize="8" fontFamily="monospace" fill="#34D399">EAVE {warehouseHeight}m</text>
          <line x1={8} y1={30} x2={30} y2={30} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x={36} y={34} fontSize="8" fontFamily="monospace" fill="#F59E0B">TRUSS {beamHeight}m</text>
          <rect x={8} y={42} width={10} height={6} fill="#10B981" fillOpacity={0.7} />
          <text x={24} y={49} fontSize="8" fontFamily="monospace" fill="#34D399">FITS CLEARANCE</text>
        </g>

        {/* Dimension labels */}
        {(() => {
          const [ax, ay] = p(w / 2, 0).split(',').map(Number)
          const [bx, by] = p(0, l / 2).split(',').map(Number)
          return (
            <>
              <text x={ax} y={ay - 8} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4B5563">
                {warehouseWidth}m →
              </text>
              <text x={bx - 28} y={by} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4B5563">
                {warehouseLength}m ↓
              </text>
            </>
          )
        })()}
      </svg>

      {/* Instruction overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        background: 'rgba(9, 11, 14, 0.8)',
        padding: '4px 8px',
        borderRadius: '3px',
        border: '1px solid var(--border-subtle)',
      }}>
        ISO CAD VIEW • CLICK EQUIPMENT TO SELECT • TRUSS BEAM: {beamHeight}m
      </div>
    </div>
  )
}

// ─── Equipment Library Palette ─────────────────────────────────────
interface EquipmentPaletteProps {
  options: EquipmentOption[]
  onPlace: (option: EquipmentOption) => void
  placedCount: number
}

export function EquipmentPalette({ options, onPlace, placedCount }: EquipmentPaletteProps) {
  return (
    <div className="hud-panel" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Boxes size={14} color="var(--accent-orange)" />
          <span className="mono-tag" style={{ color: 'var(--accent-orange)' }}>
            EQUIPMENT ASSET DRAWER
          </span>
        </div>
        <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {placedCount} PLACED
        </span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Click standard logistics model to spawn inside clearance volume:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onPlace(option)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--text-primary)',
              transition: 'all 120ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', fontFamily: 'var(--font-ui)', color: '#FFFFFF' }}>
                {option.name}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.68rem', color: 'var(--accent-orange)' }}>
                + SPAWN
              </span>
            </div>
            <span className="mono-metric" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {option.dimensions.length}m × {option.dimensions.width}m × {option.dimensions.height}m (H)
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Fit Check Telemetry HUD ──────────────────────────────────────
interface FitCheckProps {
  equipment: EquipmentItem[]
  beamHeight: number
  onClear: () => void
}

export function FitCheckOverlay({ equipment, beamHeight, onClear }: FitCheckProps) {
  const passing = equipment.filter((e) => e.fits).length
  const failing = equipment.length - passing

  if (equipment.length === 0) {
    return (
      <div className="hud-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <Ruler size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
        <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>NO EQUIPMENT ACTIVE</span>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Spawn assets from the drawer above to calculate roof truss clearance.
        </p>
      </div>
    )
  }

  return (
    <div className="hud-panel" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="mono-tag" style={{ color: '#FFFFFF' }}>CLEARANCE TELEMETRY</span>
        <button
          onClick={onClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Trash2 size={12} />
          <span>CLEAR ALL</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-xs)' }}>
          <span className="mono-tag" style={{ color: 'var(--accent-emerald)', fontSize: '0.62rem' }}>PASSED</span>
          <div className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399' }}>
            {passing} FIT
          </div>
        </div>

        <div style={{ padding: '8px', background: failing > 0 ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-secondary)', border: `1px solid ${failing > 0 ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-xs)' }}>
          <span className="mono-tag" style={{ color: failing > 0 ? '#F87171' : 'var(--text-muted)', fontSize: '0.62rem' }}>CONFLICTS</span>
          <div className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: failing > 0 ? '#F87171' : 'var(--text-muted)' }}>
            {failing} COLLISION
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
        {equipment.map((item) => {
          const margin = (beamHeight - item.dimensions.height).toFixed(2)
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>{item.name}</span>
              <span style={{ color: item.fits ? '#34D399' : '#F87171', fontWeight: 700 }}>
                {item.fits ? `+${margin}m OK` : `${margin}m TRUSS`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
