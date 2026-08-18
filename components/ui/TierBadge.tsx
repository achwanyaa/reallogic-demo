'use client'

import type { TierLevel } from '@/lib/realsee/types'

interface TierBadgeProps {
  tier: TierLevel
  size?: 'sm' | 'md'
  showPrefix?: boolean
}

export function TierBadge({ tier, size = 'sm', showPrefix = true }: TierBadgeProps) {
  const getBadgeContent = () => {
    switch (tier) {
      case 'live':
        return {
          code: showPrefix ? 'TIER 1 • LIVE' : 'LIVE',
          className: 'tier-badge--live',
          dotClass: 'status-pulse-emerald',
        }
      case 'in-development':
        return {
          code: showPrefix ? 'TIER 2 • IN DEV' : 'IN DEVELOPMENT',
          className: 'tier-badge--in-development',
          dotClass: 'status-pulse-amber',
        }
      case 'coming-with-partnership':
        return {
          code: showPrefix ? 'TIER 3 • ROADMAP' : 'ROADMAP',
          className: 'tier-badge--coming-with-partnership',
          dotClass: '',
        }
    }
  }

  const { code, className, dotClass } = getBadgeContent()

  return (
    <span
      className={`tier-badge ${className}`}
      style={
        size === 'md'
          ? { fontSize: '0.78rem', padding: '5px 10px' }
          : { fontSize: '0.68rem', padding: '3px 7px' }
      }
    >
      {dotClass && <span className={dotClass} style={{ width: '5px', height: '5px' }} />}
      <span>[{code}]</span>
    </span>
  )
}
