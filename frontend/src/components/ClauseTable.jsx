import { useState } from 'react'

const RISK_META = {
  Low: { color: '#16a34a', bg: '#f0fdf4', border: '#86efac', barColor: '#16a34a' },
  Medium: { color: '#a16207', bg: '#fefce8', border: '#fbbf24', barColor: '#ca8a04' },
  High: { color: '#c2410c', bg: '#fff7ed', border: '#fb923c', barColor: '#ea580c' },
  Critical: { color: '#b91c1c', bg: '#fef2f2', border: '#fca5a5', barColor: '#dc2626' },
}

function ClauseItem({ clause, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = RISK_META[clause.risk_level] || RISK_META.Low
  const pct = Math.min(100, Math.max(0, clause.risk_score || 0))

  return (
    <div style={{
      borderRadius: '10px',
      border: `1.5px solid ${expanded ? meta.border : '#e8d5a3'}`,
      background: '#ffffff',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(180,130,0,0.08)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      {/* ── Single-row clickable header ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#fffbf0'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        {/* Index */}
        <span style={{
          flexShrink: 0,
          width: '22px', height: '22px',
          borderRadius: '5px',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 800, color: '#92400e',
        }}>
          {index + 1}
        </span>

        {/* Risk level badge */}
        <span style={{
          flexShrink: 0,
          padding: '2px 9px',
          borderRadius: '99px',
          fontSize: '0.65rem', fontWeight: 700,
          background: meta.bg,
          border: `1px solid ${meta.border}`,
          color: meta.color,
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
        }}>
          {clause.risk_level || 'N/A'}
        </span>

        {/* Category label — takes remaining space */}
        <span style={{
          flex: 1,
          fontSize: '0.82rem', fontWeight: 600,
          color: '#78350f',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}>
          {clause.risk_category || 'Uncategorized'}
        </span>

        {/* Score bar — fixed width */}
        <div style={{
          flexShrink: 0,
          width: '100px',
          height: '6px',
          background: '#f3e8c8',
          borderRadius: '99px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: meta.barColor,
            borderRadius: '99px',
            transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Score number */}
        <span style={{
          flexShrink: 0,
          fontSize: '0.7rem', fontWeight: 700,
          color: meta.barColor,
          minWidth: '22px',
          textAlign: 'right',
        }}>
          {clause.risk_score ?? '—'}
        </span>

        {/* Chevron */}
        <svg
          style={{
            flexShrink: 0,
            width: '15px', height: '15px',
            color: '#d97706',
            transition: 'transform 0.25s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expanded clause text ── */}
      {expanded && (
        <div style={{
          padding: '10px 14px 14px',
          borderTop: `1px solid ${meta.border}`,
          background: meta.bg,
        }}>
          <p style={{
            fontSize: '0.65rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: meta.color, marginBottom: '6px', marginTop: 0,
          }}>
            Clause Text
          </p>
          <p style={{
            color: '#3b1f07', fontSize: '0.84rem',
            lineHeight: 1.75, whiteSpace: 'pre-wrap', margin: 0,
          }}>
            {clause.clause_text || 'No clause text available.'}
          </p>
        </div>
      )}
    </div>
  )
}

const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function ClauseTable({ clauses = [] }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? clauses : clauses.filter(c => c.risk_level === filter)
  const counts = clauses.reduce((acc, c) => {
    acc[c.risk_level] = (acc[c.risk_level] || 0) + 1
    return acc
  }, {})

  return (
    <div className="glass" style={{ padding: '1.25rem 1.5rem' }}>
      {/* ── Header row ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#d97706', boxShadow: '0 0 6px rgba(217,119,6,0.5)',
          }} />
          <h3 style={{ margin: 0, color: '#1c1009', fontWeight: 700, fontSize: '0.95rem' }}>
            Flagged Clauses{' '}
            <span style={{ color: '#92400e', fontWeight: 500, fontSize: '0.85rem' }}>
              ({clauses.length})
            </span>
          </h3>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            const meta = RISK_META[f]
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 11px',
                  borderRadius: '99px',
                  fontSize: '0.7rem', fontWeight: 700,
                  cursor: 'pointer', border: '1px solid',
                  background: isActive ? (meta ? meta.bg : '#fef3c7') : 'transparent',
                  borderColor: isActive ? (meta ? meta.border : '#fbbf24') : '#e8d5a3',
                  color: isActive ? (meta ? meta.color : '#d97706') : '#92400e',
                  transition: 'all 0.15s ease',
                }}
              >
                {f}{f !== 'All' && counts[f] ? ` · ${counts[f]}` : ''}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Clause list ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '7px',
        maxHeight: '560px', overflowY: 'auto', paddingRight: '4px',
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#92400e' }}>
            <p style={{ fontWeight: 600, margin: 0 }}>No clauses match this filter</p>
          </div>
        ) : (
          filtered.map((clause, idx) => (
            <ClauseItem
              key={idx}
              clause={clause}
              index={clauses.indexOf(clause)}
            />
          ))
        )}
      </div>
    </div>
  )
}
