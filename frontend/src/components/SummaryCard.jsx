export default function SummaryCard({ summary }) {
  const { summary_points = [], what_you_are_agreeing_to = '', key_facts = {} } = summary || {}

  return (
    <div className="glass glass-hover" style={{ padding: '1.75rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', boxShadow: '0 0 6px rgba(217,119,6,0.5)' }} />
        <h3 style={{ color: '#1c1009', fontWeight: 700, fontSize: '1rem' }}>Summary & Key Points</h3>
      </div>

      {summary_points.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#92400e', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Key Points</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summary_points.map((point, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#d97706', fontWeight: 700, marginTop: '2px', flexShrink: 0, fontSize: '1rem' }}>›</span>
                <span style={{ color: '#3b1f07', fontSize: '0.875rem', lineHeight: 1.65 }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {what_you_are_agreeing_to && (
        <div style={{
          marginBottom: '1.5rem',
          background: '#fff8ec', border: '1px solid rgba(217,119,6,0.22)',
          borderRadius: '12px', padding: '1rem 1.25rem',
        }}>
          <p style={{ color: '#92400e', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>What You Are Agreeing To</p>
          <p style={{ color: '#5c3107', fontSize: '0.875rem', lineHeight: 1.7 }}>{what_you_are_agreeing_to}</p>
        </div>
      )}

      {Object.keys(key_facts).length > 0 && (
        <div>
          <p style={{ color: '#92400e', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Key Facts</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(key_facts).map(([key, value]) => (
              <div key={key} style={{
                background: '#fff8ec', borderRadius: '10px', padding: '10px 14px',
                border: '1px solid rgba(217,119,6,0.15)',
              }}>
                <p style={{ color: '#92400e', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {key.replace(/_/g, ' ')}
                </p>
                <p style={{ color: '#1c1009', fontSize: '0.85rem', fontWeight: 600 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
