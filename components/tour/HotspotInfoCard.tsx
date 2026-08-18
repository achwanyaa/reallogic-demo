'use client'

import type { Hotspot, FloorSlabValues, ClearHeightValues, UtilityPowerValues, LogisticsValues } from '@/lib/realsee/types'
import { TierBadge } from '@/components/ui/TierBadge'
import { Gauge, Ruler, Zap, Truck, X, Crosshair, ShieldCheck } from 'lucide-react'

interface HotspotInfoCardProps {
  hotspot: Hotspot
  onClose: () => void
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: typeof Gauge }> = {
  floor_slab: { label: 'FLOOR SLAB SPECIFICATION', color: 'var(--accent-orange)', icon: Gauge },
  clear_height: { label: 'CLEAR HEIGHT MEASUREMENT', color: 'var(--accent-emerald)', icon: Ruler },
  utility_power: { label: 'UTILITY & POWER INFRASTRUCTURE', color: 'var(--accent-amber)', icon: Zap },
  logistics: { label: 'LOGISTICS & ACCESS DIMENSIONS', color: 'var(--accent-cyan)', icon: Truck },
}

function MetricField({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div
      style={{
        padding: '8px 10px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xs)',
      }}
    >
      <span className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>
        {label}
      </span>
      <div className="mono-metric" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
        {value} {unit && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
    </div>
  )
}

function FloorSlabCard({ values }: { values: FloorSlabValues }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <MetricField label="SLAB THICKNESS" value={values.thicknessMm} unit="mm" />
      <MetricField label="CONCRETE GRADE" value={values.concreteGrade} />
      <MetricField label="LOAD CAPACITY" value={values.loadCapacityKnPerSqm} unit="kN/m²" />
      <MetricField label="VIBRATION TOLERANCE" value={values.vibrationToleranceHz || 25} unit="Hz" />
    </div>
  )
}

function ClearHeightCard({ values }: { values: ClearHeightValues }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <MetricField label="EAVE CLEAR HEIGHT" value={values.eaveHeightM} unit="m" />
      <MetricField label="LOWEST BEAM CLEARANCE" value={values.lowestBeamHeightM} unit="m" />
      <MetricField label="SPRINKLER DROP" value={values.sprinklerDropClearanceM} unit="m" />
      <MetricField label="RACKING CAPACITY" value="3-TIER OK" />
    </div>
  )
}

function UtilityPowerCard({ values }: { values: UtilityPowerValues }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <MetricField label="MAIN AMPERAGE" value={values.powerAmperage} unit="A" />
      <MetricField label="POWER PHASE" value={values.powerPhase} />
      <MetricField label="WATER PRESSURE" value={values.waterPressureBar} unit="bar" />
      <MetricField label="HVAC / AIR FLOW" value={values.hvacCfm ? `${values.hvacCfm} CFM` : 'NATURAL'} />
    </div>
  )
}

function LogisticsCard({ values }: { values: LogisticsValues }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <MetricField label="DOCK LEVELER CAP." value={values.dockLevelerCapacityKg.toLocaleString()} unit="kg" />
      <MetricField label="ROLLER DOOR WIDTH" value={values.rollerDoorWidthM} unit="m" />
      <MetricField label="ROLLER DOOR HEIGHT" value={values.rollerDoorHeightM} unit="m" />
      <MetricField label="TURNING RADIUS" value={values.turningRadiusM} unit="m" />
    </div>
  )
}

export function HotspotInfoCard({ hotspot, onClose }: HotspotInfoCardProps) {
  const config = CATEGORY_CONFIG[hotspot.category] || {
    label: 'SPATIAL TELEMETRY',
    color: 'var(--accent-orange)',
    icon: Crosshair,
  }
  const Icon = config.icon

  const renderValues = () => {
    switch (hotspot.category) {
      case 'floor_slab':
        return <FloorSlabCard values={hotspot.values as FloorSlabValues} />
      case 'clear_height':
        return <ClearHeightCard values={hotspot.values as ClearHeightValues} />
      case 'utility_power':
        return <UtilityPowerCard values={hotspot.values as UtilityPowerValues} />
      case 'logistics':
        return <LogisticsCard values={hotspot.values as LogisticsValues} />
      default:
        return <p style={{ color: 'var(--text-muted)' }}>No data available</p>
    }
  }

  return (
    <div
      className="hud-panel corner-brackets"
      style={{
        width: '360px',
        padding: '16px',
        background: 'rgba(9, 12, 16, 0.96)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${config.color}`,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.85)',
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={16} color={config.color} />
          <div>
            <span className="mono-tag" style={{ color: config.color, fontSize: '0.65rem' }}>
              {config.label}
            </span>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>{hotspot.label}</h4>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '2px',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ marginBottom: '14px' }}>{renderValues()}</div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} color="var(--accent-emerald)" />
          LIDAR AUDITED
        </span>
        <TierBadge tier="in-development" />
      </div>
    </div>
  )
}
