import { useRef, useState } from 'react'

export default function UploadSection({ onAnalysis, loading, error }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const processFile = async (file) => {
    if (!file) return
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) { alert('Please upload a PDF or DOCX file'); return }
    setSelectedFile(file)
    await onAnalysis(file)
  }

  const handleFileChange = (e) => { const f = e.target.files?.[0]; if (f) processFile(f) }
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f) }
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)

  return (
    <div>
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 20px', borderRadius: '12px', marginBottom: '1.5rem',
          background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.3)',
        }}>
          <svg width="16" height="16" fill="none" stroke="#ea580c" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
          </svg>
          <p style={{ color: '#c2410c', fontSize: '0.875rem', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={loading}
        style={{
          width: '100%', padding: '3rem 2rem', borderRadius: '20px',
          border: `2px dashed ${dragOver ? '#d97706' : 'rgba(217,119,6,0.3)'}`,
          background: dragOver ? 'rgba(251,191,36,0.08)' : '#ffffff',
          boxShadow: dragOver ? '0 0 20px rgba(217,119,6,0.12)' : '0 2px 12px rgba(217,119,6,0.06)',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          opacity: loading ? 0.75 : 1,
        }}
      >
        {loading ? (
          <>
            <div className="spinner" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#d97706', fontWeight: 600, fontSize: '1rem' }}>Analyzing Contract…</p>
              <p style={{ color: '#92400e', fontSize: '0.8rem', marginTop: '4px' }}>AI is reviewing clauses and risk dimensions</p>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#1c1009', fontWeight: 700, fontSize: '1.1rem' }}>
                {selectedFile ? selectedFile.name : 'Drop your contract here'}
              </p>
              <p style={{ color: '#92400e', fontSize: '0.85rem', marginTop: '6px' }}>
                or <span style={{ color: '#d97706', textDecoration: 'underline', fontWeight: 600 }}>browse to upload</span>
              </p>
              <p style={{ color: '#c4a24d', fontSize: '0.72rem', marginTop: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                PDF · DOCX
              </p>
            </div>
          </>
        )}
      </button>
      <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  )
}
