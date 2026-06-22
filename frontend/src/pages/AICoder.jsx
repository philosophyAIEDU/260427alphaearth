import { useState, useRef, useEffect } from 'react'

const MODEL = 'gemini-3.1-flash-lite'
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

const SYSTEM_PROMPT = `You are a Google Earth Engine (GEE) JavaScript expert.
When the user describes what they want to analyze, generate complete, runnable GEE JavaScript code.

Rules:
- Always output ONLY valid GEE JavaScript code (no markdown fences, no explanation outside comments)
- Start with a comment block explaining what the code does in Korean (한국어)
- Always include Map.centerObject() and Map.addLayer() to visualize results
- Use real GEE dataset IDs (e.g. 'COPERNICUS/S2_SR_HARMONIZED', 'MODIS/061/MOD11A1')
- Add Korean inline comments (// 주석) explaining key lines
- Keep code concise but complete — must run without errors
- If the user mentions Korea/한국/서울/부산 etc., center the map on Korea by default
- Default region: Korea (ee.Geometry.Rectangle([124.5, 33.0, 130.0, 38.9])) unless user specifies
- Always print useful info to Console with print()`

const EXAMPLE_PROMPTS = [
  '서울의 2024년 여름철 NDVI를 계산하고 지도에 표시해줘',
  '한반도 2024년 7월 지표면 온도(LST)를 열화상 색으로 보여줘',
  '제주도 2020~2024년 NDVI 시계열 차트를 만들어줘',
  '인천 지역 2024년 Sentinel-2 트루컬러 이미지를 보여줘',
  '한국 해안선 근처의 수분 지수(NDWI)를 계산해줘',
  '부산의 2023년과 2024년 여름 LST 변화를 비교해줘',
]

function CodeDisplay({ code, onCopy, copied }) {
  if (!code) return null
  return (
    <div style={{ position: 'relative', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          생성된 GEE 코드
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onCopy}
            className="btn btn-outline"
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderColor: copied ? 'var(--green)' : undefined, color: copied ? 'var(--green)' : undefined }}
          >
            {copied ? '✓ 복사됨' : '📋 복사'}
          </button>
          <a
            href="https://code.earthengine.google.com/"
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
          >
            GEE Editor ↗
          </a>
        </div>
      </div>
      <div style={{ position: 'relative', background: '#060d1a', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: '#0d1b2e', borderBottom: '1px solid var(--border)', padding: '0.4rem 0.9rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {['#f87171','#facc15','#34d399'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>Google Earth Engine · JavaScript</span>
        </div>
        <pre style={{ margin: 0, padding: '1.25rem', fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '0.83rem', lineHeight: 1.7, color: '#e2e8f0', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {code.split('\n').map((line, i) => {
            let color = '#e2e8f0'
            if (line.trimStart().startsWith('//')) color = '#4b7fa0'
            else if (/^\s*(var|function|return|if|else|for)\b/.test(line)) color = '#c084fc'
            return (
              <div key={i} style={{ display: 'flex', minHeight: '1.3em' }}>
                <span style={{ color: '#2d3f58', userSelect: 'none', minWidth: 32, textAlign: 'right', marginRight: '1.2rem', fontSize: '0.75rem', paddingTop: '0.05em' }}>{i + 1}</span>
                <span style={{ color, flex: 1 }}>{line || '​'}</span>
              </div>
            )
          })}
        </pre>
      </div>
      <div className="info-box" style={{ marginTop: '0.75rem' }}>
        위 코드를 <strong>복사</strong>한 뒤 <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">GEE Code Editor</a>에 붙여넣고 <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 5px', fontFamily: 'monospace' }}>Ctrl+Enter</kbd>로 실행하세요.
      </div>
    </div>
  )
}

export default function AICoder() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const [showKey, setShowKey] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [keyStatus, setKeyStatus] = useState(localStorage.getItem('gemini_api_key') ? 'saved' : '')
  const textareaRef = useRef(null)

  const saveKey = () => {
    const trimmed = apiKey.trim()
    if (!trimmed) { setKeyStatus('empty'); return }
    localStorage.setItem('gemini_api_key', trimmed)
    setKeyStatus('saved')
  }

  const clearKey = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setKeyStatus('')
  }

  const generate = async () => {
    const key = apiKey.trim()
    if (!key) { setError('Gemini API 키를 먼저 입력해주세요.'); return }
    if (!prompt.trim()) { setError('분석하고 싶은 내용을 입력해주세요.'); return }

    setLoading(true)
    setError('')
    setCode('')

    try {
      const res = await fetch(`${API_BASE}/${MODEL}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{
            role: 'user',
            parts: [{ text: prompt.trim() }],
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      // strip markdown code fences if model wraps anyway
      text = text.replace(/^```(?:javascript|js)?\n?/i, '').replace(/\n?```\s*$/i, '').trim()
      setCode(text)
    } catch (e) {
      setError(`오류: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const useExample = (ex) => {
    setPrompt(ex)
    textareaRef.current?.focus()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="section-title">🤖 AI 코드 생성기</div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
        분석하고 싶은 내용을 자연어로 설명하면 <strong>Gemini AI</strong>가 바로 실행 가능한
        GEE JavaScript 코드를 생성합니다.
      </p>

      {/* API Key Section */}
      <div className="demo-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
          <span style={{ fontSize: '1rem' }}>🔑</span>
          <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Gemini API 키 설정</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.15rem 0.6rem', borderRadius: 999, background: keyStatus === 'saved' ? 'rgba(52,211,153,0.1)' : 'rgba(148,163,184,0.1)', color: keyStatus === 'saved' ? 'var(--green)' : 'var(--muted)', border: `1px solid ${keyStatus === 'saved' ? 'var(--green)' : 'var(--border)'}` }}>
            {keyStatus === 'saved' ? '✓ 저장됨' : '미설정'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setKeyStatus('') }}
              placeholder="AIzaSy..."
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.55rem 2.5rem 0.55rem 0.75rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <button className="btn btn-primary" onClick={saveKey} style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            저장
          </button>
          {keyStatus === 'saved' && (
            <button className="btn btn-outline" onClick={clearKey} style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}>
              삭제
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          API 키는 브라우저 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다. &nbsp;
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>
            Google AI Studio에서 무료 발급 ↗
          </a>
          &nbsp;·&nbsp; 모델: <code style={{ color: 'var(--accent)', fontSize: '0.82em' }}>{MODEL}</code>
        </div>
      </div>

      {/* Prompt input */}
      <div className="demo-panel" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.9rem', fontSize: '0.95rem' }}>💬 어떤 분석을 원하시나요?</h3>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="예: 서울의 2024년 여름 NDVI를 계산해서 지도에 초록색으로 표시해줘"
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate() }}
          style={{
            width: '100%', minHeight: 90, background: 'var(--bg3)',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '0.75rem', color: 'var(--text)', fontSize: '0.95rem',
            resize: 'vertical', outline: 'none', lineHeight: 1.6,
            fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Ctrl+Enter로 빠르게 실행</span>
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={loading}
            style={{ padding: '0.65rem 1.8rem', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(11,17,32,0.3)', borderTopColor: '#0b1120', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                생성 중...
              </span>
            ) : '✨ 코드 생성'}
          </button>
        </div>
      </div>

      {/* Example prompts */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          💡 예시 프롬프트 (클릭하면 입력됩니다)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {EXAMPLE_PROMPTS.map(ex => (
            <button
              key={ex}
              onClick={() => useExample(ex)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '0.4rem 0.75rem',
                fontSize: '0.8rem', color: 'var(--muted)', cursor: 'pointer',
                transition: 'all 0.12s', textAlign: 'left',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--red)', borderRadius: 8, padding: '0.75rem 1rem', color: 'var(--red)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Generated code */}
      <CodeDisplay code={code} onCopy={copy} copied={copied} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
