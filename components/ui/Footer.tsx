import { Shield } from 'lucide-react'

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
          <span>This is a sample property and the measurements are for demonstration only.</span>
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
              <span style={{ fontWeight: 700 }}>What this demo shows</span>
          </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
              A property page with a 3D tour, measured site information, and equipment clearance checks.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF' }}>
            <Shield size={15} color="var(--accent-emerald)" />
              <span style={{ fontWeight: 700 }}>Verification</span>
          </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
              The verification badge identifies which information is currently part of the demonstration.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF' }}>
              <span style={{ fontWeight: 700 }}>Next step</span>
          </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
              Connect a real Realsee space and replace the sample values with verified project data.
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
            © {new Date().getFullYear()} Reallogic
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Industrial Area, Nairobi</span>
        </div>
      </div>
    </footer>
  )
}
