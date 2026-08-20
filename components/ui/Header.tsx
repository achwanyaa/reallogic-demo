'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Eye } from 'lucide-react'
import { SAMPLE_LISTING_ID } from '@/lib/data/mock-data'

export function Header() {
  const pathname = usePathname()

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Sample listing', href: `/listing/${SAMPLE_LISTING_ID}` },
    { label: 'How it works', href: '/#how-it-works' },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(251, 250, 246, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-medium)',
      }}
    >
      {/* Quiet demo notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 24px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-ui)',
          color: 'var(--text-muted)',
        }}
      >
          <span style={{ color: 'var(--text-primary)' }}>LuxuryBoma360 demonstration</span>
        <span className="hidden sm:inline">Sample property data · Reallogic Kenya</span>
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
        {/* Brand */}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: 'var(--text-primary)',
                }}
              >
                REALLOGIC
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--accent-orange)',
                  border: '1px solid var(--border-medium)',
                  fontWeight: 700,
                }}
              >
                  demo
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Verification layer for property and capital
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
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-secondary)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  borderRadius: '999px',
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
            <span className="hidden sm:inline">Explore the sample</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
