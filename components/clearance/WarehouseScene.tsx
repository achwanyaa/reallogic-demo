'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Boxes, AlertTriangle, CheckCircle2, Ruler, Trash2 } from 'lucide-react'

export interface EquipmentItem {
  id: string
  name: string
  dimensions: { length: number; width: number; height: number }
  position: [number, number, number]
  color: string
  fits: boolean
}

interface WarehouseSceneProps {
  warehouseWidth: number  // meters
  warehouseLength: number // meters
  warehouseHeight: number // meters (eave height)
  beamHeight: number      // meters (lowest beam)
  equipment: EquipmentItem[]
  selectedId: string | null
  onSelectEquipment: (id: string | null) => void
}

function WarehouseBox({
  width,
  length,
  height,
}: {
  width: number
  length: number
  height: number
}) {
  return (
    <group>
      {/* Floor Slab with structural grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#0B0E13"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Structural bounding wireframe */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(width, height, length)]}
        />
        <lineBasicMaterial color="#27313F" linewidth={1.5} />
      </lineSegments>

      {/* Height elevation indicators on column */}
      {[2, 4, 6, 7.2, 8.5].map((h) => (
        <group key={h} position={[-width / 2 - 0.5, h, 0]}>
          <Text
            fontSize={0.35}
            color={h === 7.2 ? '#F59E0B' : '#606774'}
            anchorX="right"
            anchorY="middle"
          >
            {h === 7.2 ? `▲ TRUSS ${h}m` : `${h}m`}
          </Text>
        </group>
      ))}
    </group>
  )
}

function BeamWarningPlane({
  width,
  length,
  height,
}: {
  width: number
  length: number
  height: number
}) {
  return (
    <group position={[0, height, 0]}>
      {/* Translucent Clearance Warning Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#F59E0B"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Beam structural perimeter wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, 0.1, length)]} />
        <lineBasicMaterial color="#F59E0B" linewidth={1.5} />
      </lineSegments>

      <group position={[-width / 2 - 0.5, 0, 0]}>
        <Text fontSize={0.3} color="#F59E0B" anchorX="right" anchorY="middle">
          LOWEST TRUSS BEAM: {height}m
        </Text>
      </group>
    </group>
  )
}

function EquipmentMesh({
  item,
  isSelected,
  onClick,
}: {
  item: EquipmentItem
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y =
        item.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.04
    }
  })

  const { length, width, height } = item.dimensions

  return (
    <group position={item.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        castShadow
      >
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial
          color={item.fits ? item.color : '#F43F5E'}
          transparent
          opacity={isSelected ? 0.95 : 0.75}
          emissive={isSelected ? (item.fits ? item.color : '#F43F5E') : '#000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* CAD outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
        <lineBasicMaterial
          color={item.fits ? '#34D399' : '#F43F5E'}
          linewidth={2}
        />
      </lineSegments>

      {/* 3D Space Label */}
      <Html position={[0, height / 2 + 0.45, 0]} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(9, 11, 14, 0.95)',
            border: `1px solid ${item.fits ? '#10B981' : '#F43F5E'}`,
            borderRadius: '2px',
            padding: '3px 8px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
          }}
        >
          <span>{item.name}</span>
          <div style={{ color: item.fits ? '#34D399' : '#F87171', fontWeight: 700 }}>
            {item.fits ? `✓ OK (${height}m)` : `✗ COLLISION (${height}m)`}
          </div>
        </div>
      </Html>
    </group>
  )
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
  return (
    <Canvas
      camera={{ position: [warehouseWidth * 0.9, warehouseHeight * 0.9, warehouseLength * 0.9], fov: 48 }}
      shadows
      style={{ background: '#060708', width: '100%', height: '100%' }}
      onPointerMissed={() => onSelectEquipment(null)}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 20, 15]}
        intensity={0.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, warehouseHeight - 1, 0]} intensity={0.5} color="#06B6D4" />

      {/* Warehouse Structural Volume */}
      <group position={[0, 0, 0]}>
        <WarehouseBox
          width={warehouseWidth}
          length={warehouseLength}
          height={warehouseHeight}
        />
        <BeamWarningPlane
          width={warehouseWidth}
          length={warehouseLength}
          height={beamHeight}
        />
      </group>

      {/* Placed Equipment Objects */}
      {equipment.map((item) => (
        <EquipmentMesh
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onClick={() => onSelectEquipment(item.id)}
        />
      ))}

      {/* 1-Meter Floor Grid */}
      <Grid
        args={[60, 60]}
        cellSize={1}
        cellColor="#1C232D"
        sectionSize={5}
        sectionColor="#27313F"
        fadeDistance={45}
        position={[0, 0.01, 0]}
      />

      <OrbitControls
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={55}
        target={[0, warehouseHeight / 3, 0]}
      />
    </Canvas>
  )
}

// ─── Equipment Library Palette ─────────────────────────────────────
export interface EquipmentOption {
  id: string
  name: string
  dimensions: { length: number; width: number; height: number }
  description?: string
}

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
        Click standard logistics model to spawn inside 3D volume:
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
            className="hover:border-orange-500 hover:bg-neutral-900"
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
          className="hover:text-red-400"
        >
          <Trash2 size={12} />
          <span>CLEAR ALL</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div
          style={{
            padding: '8px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <span className="mono-tag" style={{ color: 'var(--accent-emerald)', fontSize: '0.62rem' }}>PASSED</span>
          <div className="mono-metric" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399' }}>
            {passing} FIT
          </div>
        </div>

        <div
          style={{
            padding: '8px',
            background: failing > 0 ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-secondary)',
            border: `1px solid ${failing > 0 ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <span className="mono-tag" style={{ color: failing > 0 ? 'var(--accent-rose)' : 'var(--text-muted)', fontSize: '0.62rem' }}>
            CONFLICTS
          </span>
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
