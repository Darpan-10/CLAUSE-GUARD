function getRiskMeta(score) {
  if (score < 30) return { label: 'Low Risk', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }
  if (score < 50) return { label: 'Medium Risk', color: '#ca8a04', bg: '#fefce8', border: '#fde68a' }
  if (score < 75) return { label: 'High Risk', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' }
  return { label: 'Critical', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
}

function StatCard({ label, value, accent, icon }) {
  return (
    <div style={{
      background: '#fff8ec',
      border: `1px solid ${accent}30`,
      borderRadius: '14px',
      padding: '1.25rem 1.5rem',
      display: 'flex', flexDirection: 'column', gap: '8px',
      boxShadow: '0 1px 8px rgba(217,119,6,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <p style={{ color: '#92400e', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
      </div>
      <p style={{ color: accent, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
    </div>
  )
}

export default function OverviewCard({ data }) {
  const meta = getRiskMeta(data.overall_risk_score)
  const score = data.overall_risk_score?.toFixed(1) ?? '—'
  const confidence = data.confidence != null ? `${(data.confidence * 100).toFixed(0)}%` : '—'
  const clauseCount = data.clauses?.length ?? '—'

  return (
    <div className="glass" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', boxShadow: '0 0 6px rgba(217,119,6,0.5)' }} />
          <h3 style={{ color: '#1c1009', fontWeight: 700, fontSize: '1rem' }}>Contract Overview</h3>
        </div>
        <div style={{
          padding: '6px 16px', borderRadius: '99px', fontWeight: 700, fontSize: '0.85rem',
          background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color,
        }}>
          {meta.label}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <StatCard label="Contract Type" value={data.contract_type ?? '—'} accent="#d97706" icon="📄" />
        <StatCard label="Confidence" value={confidence} accent="#b45309" icon="🎯" />
        <StatCard label="Risk Score" value={score} accent={meta.color} icon="⚠️" />
        <StatCard label="Flagged Clauses" value={clauseCount} accent="#ea580c" icon="🚩" />
      </div>
    </div>
  )
}
