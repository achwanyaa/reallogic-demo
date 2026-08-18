'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Boxes, Compass, Eye, ShieldCheck, Terminal } from 'lucide-react'
import { SAMPLE_LISTING_ID } from '@/lib/data/mock-data'

export function Header() {
  const pathname = usePathname()

  const navLinks = [
    { label: 'PLATFORM', href: '/' },
    { label: 'DOSSIER', href: `/listing/${SAMPLE_LISTING_ID}` },
    { label: '3D TOUR', href: `/listing/${SAMPLE_LISTING_ID}/tour` },
    { label: 'CLEARANCE SIM', href: `/listing/${SAMPLE_LISTING_ID}/clearance` },
    { label: 'TECH PACKET', href: `/listing/${SAMPLE_LISTING_ID}/packet` },
    { label: 'ADMIN', href: '/admin' },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 11, 14, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-medium)',
      }}
    >
      {/* Top Telemetry Ticker Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 24px',
          background: 'var(--bg-void)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
            <span className="status-pulse-emerald" />
            SYSTEM: ONLINE
          </span>
          <span className="hidden sm:inline" style={{ color: 'var(--border-strong)' }}>|</span>
          <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
            SPATIAL ENGINE: ONLINE • ACCURACY: ±15mm
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="hidden md:inline">LATENCY: 14ms</span>
          <span style={{ color: 'var(--accent-orange)' }}>CAD/SPATIAL READY</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-orange)',
              boxShadow: '0 0 12px var(--accent-orange-glow)',
            }}
          >
            <Boxes size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                REALLOGIC
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(249, 115, 22, 0.15)',
                  color: 'var(--accent-orange)',
                  border: '1px solid rgba(249, 115, 22, 0.4)',
                  fontWeight: 700,
                }}
              >
                CAD-v2
              </span>
            </div>
            <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: 1 }}>
              SPATIAL INTELLIGENCE
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent',
                  borderRadius: 'var(--radius-xs)',
                  textDecoration: 'none',
                  transition: 'all 120ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Quick Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href={`/listing/${SAMPLE_LISTING_ID}/tour`}
            className="tech-btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.75rem', gap: '6px' }}
          >
            <Eye size={14} />
            <span className="hidden sm:inline">INSPECT SPACE</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
