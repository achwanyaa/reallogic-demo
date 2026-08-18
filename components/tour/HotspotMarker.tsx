'use client'

import type { HotspotCategory } from '@/lib/realsee/types'
import { Gauge, Ruler, Zap, Truck, Crosshair } from 'lucide-react'

interface HotspotMarkerProps {
  category: HotspotCategory
  label: string
  x: number // percentage position 0-100
  y: number // percentage position 0-100
  onClick: () => void
  isActive: boolean
}

const CATEGORY_CONFIG: Record<HotspotCategory, { icon: typeof Gauge; color: string; code: string }> = {
  floor_slab: { icon: Gauge, color: 'var(--accent-orange)', code: 'SLAB' },
  clear_height: { icon: Ruler, color: 'var(--accent-emerald)', code: 'HEIGHT' },
  utility_power: { icon: Zap, color: 'var(--accent-amber)', code: 'POWER' },
  logistics: { icon: Truck, color: 'var(--accent-cyan)', code: 'DOCK' },
}

export function HotspotMarker({
  category,
  label,
  x,
  y,
  onClick,
  isActive,
}: HotspotMarkerProps) {
  const { icon: Icon, color, code } = CATEGORY_CONFIG[category] || { icon: Crosshair, color: '#F97316', code: 'POINT' }

  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.15 : 1})`,
        zIndex: isActive ? 40 : 25,
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: 0,
        outline: 'none',
        transition: 'transform 150ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 10px',
          background: isActive ? 'var(--bg-void)' : 'rgba(9, 11, 14, 0.92)',
          border: `1px solid ${isActive ? color : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-xs)',
          boxShadow: isActive ? `0 0 20px ${color}50` : '0 4px 14px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={12} color={color} />
        </div>
        <span
          className="mono-metric"
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
          }}
        >
          [{code}]
        </span>
      </div>
    </button>
  )
}
