import { useState } from 'react'
import UploadSection from './components/UploadSection'
import OverviewCard from './components/OverviewCard'
import RiskRadar from './components/RiskRadar'
import SummaryCard from './components/SummaryCard'
import ClauseTable from './components/ClauseTable'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysis = async (file) => {
    setLoading(true)
    setError(null)
    setData(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Analysis failed — please try again.')
      setData(await response.json())
    } catch (err) {
      setError(err.message || 'Error analyzing file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fffbf3' }}>
      {/* Subtle warm background tint pattern */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-60px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(217,119,6,0.2)',
        background: 'rgba(255,251,243,0.92)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div className="container-app" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#d97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217,119,6,0.35)',
            }}>
              <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>ClauseGuard</h1>
              <p style={{ fontSize: '0.7rem', color: '#b45309', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>AI Contract Analysis</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 500 }}>API Online</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container-app" style={{ padding: '2.5rem 2rem', position: 'relative', zIndex: 1 }}>
        <UploadSection onAnalysis={handleAnalysis} loading={loading} error={error} />

        {data && !loading && (
          <div className="slide-up">
            <div className="divider" style={{ marginTop: '2.5rem' }} />
            <OverviewCard data={data} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <RiskRadar dimensions={data.risk_dimensions} />
              <SummaryCard summary={data.summary} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <ClauseTable clauses={data.clauses} />
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#fbbf24', opacity: 0.6 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#92400e' }}>Upload a contract to begin AI analysis</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#b45309' }}>Supports PDF and DOCX formats</p>
          </div>
        )}
      </main>
    </div>
  )
}
