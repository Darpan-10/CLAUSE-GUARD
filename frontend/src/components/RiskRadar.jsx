import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff8ec', border: '1px solid rgba(217,119,6,0.35)',
        borderRadius: '10px', padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(217,119,6,0.12)',
      }}>
        <p style={{ color: '#92400e', fontWeight: 600, fontSize: '0.8rem' }}>{payload[0].payload.name}</p>
        <p style={{ color: '#1c1009', fontSize: '1rem', fontWeight: 700 }}>
          {payload[0].value}<span style={{ color: '#b45309', fontSize: '0.75rem' }}>/100</span>
        </p>
      </div>
    )
  }
  return null
}

function getScoreColor(value) {
  if (value < 30) return '#16a34a'
  if (value < 50) return '#ca8a04'
  if (value < 75) return '#ea580c'
  return '#dc2626'
}

export default function RiskRadar({ dimensions }) {
  if (!dimensions || typeof dimensions !== 'object') {
    return (
      <div className="glass glass-hover" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ color: '#92400e', fontSize: '0.875rem' }}>No risk data available</p>
      </div>
    )
  }

  const data = Object.entries(dimensions).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: typeof value === 'number' ? value : 0,
  }))

  return (
    <div className="glass glass-hover" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', boxShadow: '0 0 6px rgba(217,119,6,0.5)' }} />
        <h3 style={{ color: '#1c1009', fontWeight: 700, fontSize: '1rem' }}>Risk Dimensions</h3>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#ea580c" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="rgba(217,119,6,0.18)" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#92400e', fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#b45309' }} tickCount={5} />
          <Radar name="Risk Score" dataKey="value" stroke="#d97706" fill="url(#radarFill)" fillOpacity={1} strokeWidth={2} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="divider" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {data.map((item) => (
          <div key={item.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fff8ec', borderRadius: '8px', padding: '8px 12px',
            border: '1px solid rgba(217,119,6,0.15)',
          }}>
            <span style={{ color: '#92400e', fontSize: '0.75rem', fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: getScoreColor(item.value), fontSize: '0.85rem', fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
