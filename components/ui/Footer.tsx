export function Footer() {
  return (
    <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-medium)', background: 'var(--bg-secondary)' }}>
      <div
        style={{
          maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap',
        }}
      >
          <div style={{ color: 'var(--text-secondary)' }}>
            <div className="display-heading" style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '8px' }}>LuxuryBoma360</div>
            <p style={{ maxWidth: '430px', lineHeight: 1.6 }}>The verification layer between property and capital. A Reallogic Kenya partnership demonstration by Achwanya Digital Media.</p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: '10px' }}>Sample data</div>
          <p style={{ maxWidth: '330px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>This sample listing demonstrates the workflow. A live Realsee work will replace the local capture once access is provided.</p>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid var(--border-medium)', maxWidth: '1200px', margin: '0 auto', padding: '18px 24px 24px',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: 'var(--text-muted)', fontSize: '0.78rem',
        }}
      >
        <span>© {new Date().getFullYear()} Achwanya Digital Media</span>
        <span>Industrial Area, Nairobi · achwanyatours@gmail.com</span>
      </div>
    </footer>
  )
}
