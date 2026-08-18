import { Terminal, Shield, Cpu, Activity } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-medium)', background: 'var(--bg-void)' }}>
      {/* Sample Data Disclaimer Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 24px',
          background: 'rgba(245, 158, 11, 0.06)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-amber)',
          letterSpacing: '0.04em',
        }}
      >
        <span className="status-pulse-amber" style={{ width: '5px', height: '5px' }} />
        <span>[NOTICE] STRUCTURAL METRICS & EQUIPMENT DATA CONFIGURED FOR NAIROBI INDUSTRIAL CORRIDOR (SAMPLE SPECIFICATION)</span>
      </div>

      {/* Engineering Metadata Grid */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '32px 24px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF' }}>
            <Cpu size={15} color="var(--accent-orange)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>ENGINE CORE</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
            High-Performance WebGL Spatial Mesh Engine & Photogrammetry Pipeline. Server-side token exchange with proxy isolation.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF' }}>
            <Shield size={15} color="var(--accent-emerald)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>SURVEY ACCURACY</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
            ±15mm volumetric precision via LiDAR point clouds and calibrated 360° equirectangular photogrammetry.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF' }}>
            <Terminal size={15} color="var(--accent-cyan)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>AEC COMPLIANCE</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
            Structural slab tolerance (kN/m²), clear truss heights, 3-phase amperage, and turning radius telemetry.
          </p>
        </div>
      </div>

      {/* Bottom Legal & Copyright */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © {new Date().getFullYear()} REALLOGIC SPATIAL INTELLIGENCE PLATFORM • ALL RIGHTS RESERVED
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>LOC: -1.3197° S, 36.8524° E</span>
          <span style={{ color: 'var(--accent-emerald)' }}>[TELEMETRY: STABLE]</span>
        </div>
      </div>
    </footer>
  )
}
