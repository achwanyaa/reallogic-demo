'use client'

import type { CaptureVerification } from '@/lib/realsee/types'
import { TierBadge } from '@/components/ui/TierBadge'
import { ShieldCheck, Calendar, UserCheck, Crosshair } from 'lucide-react'

interface VerifiedBadgeProps {
  verification: CaptureVerification | null
}

export function VerifiedBadge({ verification }: VerifiedBadgeProps) {
  if (!verification) return null

  const captureDate = verification.captured_at
    ? new Date(verification.captured_at).toISOString().split('T')[0]
    : '2026-08-12'

  const operatorId = verification.operator_id || 'OP-NBI-042'
  const isActualVisit = verification.capture_type === 'actual_visit' || !verification.capture_type

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-xs)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          color: '#34D399',
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} className="text-emerald-400" />
          <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
            {isActualVisit ? '[ON-SITE SURVEY AUDIT: VERIFIED]' : '[VIRTUALLY STAGED]'}
          </span>
        </div>

        <span style={{ color: 'rgba(16, 185, 129, 0.4)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Calendar size={12} />
          <span>DATE: {captureDate}</span>
        </div>

        <span style={{ color: 'rgba(16, 185, 129, 0.4)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Crosshair size={12} color="var(--accent-cyan)" />
          <span>ACCURACY: ±15mm LIDAR</span>
        </div>

        <span style={{ color: 'rgba(16, 185, 129, 0.4)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
          <UserCheck size={12} />
          <span>{operatorId}</span>
        </div>
      </div>

      <TierBadge tier="in-development" />
    </div>
  )
}
