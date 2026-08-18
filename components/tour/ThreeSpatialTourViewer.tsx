'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Hotspot } from '@/lib/realsee/types'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface ThreeSpatialTourViewerProps {
  panoramaUrl: string
  hotspots: Hotspot[]
  activeHotspot: Hotspot | null
  onSelectHotspot: (hotspot: Hotspot | null) => void
  activeFloorLayer?: 'ground' | 'mezzanine' | 'truss'
}

// 360° Inverted Sphere rendering the equirectangular panorama texture
function PanoramaSphere({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

// Interactive 3D Hotspot Pin in spherical space
function HotspotPin({
  hotspot,
  isActive,
  onClick,
}: {
  hotspot: Hotspot
  isActive: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)

  // Map position coordinates to spherical/3D position
  const x = (hotspot.position.x || 0) * 15
  const y = (hotspot.position.y || 1) * 15
  const z = (hotspot.position.z || -1) * 15

  // Subtle pulsing animation on frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.08
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  const categoryColors: Record<string, string> = {
    floor_slab: '#F97316',
    clear_height: '#10B981',
    utility_power: '#F59E0B',
    logistics: '#06B6D4',
  }
  const pinColor = categoryColors[hotspot.category] || '#F97316'

  return (
    <group ref={meshRef} position={[x, y, z]} onClick={(e) => { e.stopPropagation(); onClick() }}>
      {/* Outer Halo */}
      <mesh>
        <ringGeometry args={[1.2, 1.6, 32]} />
        <meshBasicMaterial color={pinColor} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      {/* Center Core */}
      <mesh>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color={isActive ? '#FFFFFF' : pinColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function ThreeSpatialTourViewer({
  panoramaUrl,
  hotspots,
  activeHotspot,
  onSelectHotspot,
}: ThreeSpatialTourViewerProps) {
  const [fov, setFov] = useState(75)
  const [heading, setHeading] = useState(0)
  const controlsRef = useRef<any>(null)

  const handleZoomIn = () => setFov((prev) => Math.max(35, prev - 10))
  const handleZoomOut = () => setFov((prev) => Math.min(95, prev + 10))
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    setFov(75)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050709', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 0.1], fov }}
        style={{ width: '100%', height: '100%' }}
      >
        <PanoramaSphere url={panoramaUrl} />

        {hotspots.map((h) => (
          <HotspotPin
            key={h.id}
            hotspot={h}
            isActive={activeHotspot?.id === h.id}
            onClick={() => onSelectHotspot(activeHotspot?.id === h.id ? null : h)}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.45}
          dampingFactor={0.08}
          enableDamping={true}
          minDistance={0.01}
          maxDistance={2}
          onChange={(e) => {
            if (e?.target) {
              const azimuth = (e.target.getAzimuthalAngle() * (180 / Math.PI) + 360) % 360
              setHeading(Math.round(azimuth))
            }
          }}
        />
      </Canvas>

      {/* ─── Bottom-Right On-Screen Viewport Controls ───────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '6px',
          background: 'rgba(9, 11, 14, 0.85)',
          padding: '6px',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--border-medium)',
          backdropFilter: 'blur(8px)',
          zIndex: 30,
        }}
      >
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: '#FFFFFF',
            padding: '6px',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: '#FFFFFF',
            padding: '6px',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={handleResetView}
          title="Reset Orientation"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-orange)',
            padding: '6px',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* ─── Bottom-Left Live Spatial Navigation Watermark ─────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(9, 11, 14, 0.85)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          backdropFilter: 'blur(8px)',
          zIndex: 30,
        }}
      >
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 6px var(--accent-emerald)' }} />
        <span>REALLOGIC SPATIAL ENGINE</span>
        <span style={{ color: 'var(--border-strong)' }}>|</span>
        <span style={{ color: '#FFFFFF' }}>AZIMUTH: {heading.toString().padStart(3, '0')}°</span>
      </div>
    </div>
  )
}
