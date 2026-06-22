import { useState, useRef, useEffect } from 'react'

const LOCATIONS = [
  { name: '서울 시청', lat: 37.5665, lon: 126.978 },
  { name: '부산 해운대', lat: 35.1586, lon: 129.1603 },
  { name: '대구 중구', lat: 35.8714, lon: 128.6014 },
  { name: '인천 연수구', lat: 37.41, lon: 126.678 },
  { name: '광주 동구', lat: 35.1468, lon: 126.9218 },
  { name: '제주 시내', lat: 33.4996, lon: 126.5312 },
]

function simulateRisk(lat, lon, temperature) {
  const seed = Math.abs(Math.sin(lat * 127.1 + lon * 311.7) * 43758.5) % 1
  const base = seed * 60 + 15
  const tempBonus = temperature ? Math.max(0, (temperature - 25) * 1.2) : 0
  const score = Math.min(100, base + tempBonus)
  const similarity = 0.4 + seed * 0.5
  let level
  if (score >= 75) level = 'CRITICAL'
  else if (score >= 50) level = 'HIGH'
  else if (score >= 25) level = 'MEDIUM'
  else level = 'LOW'
  return { risk_score: Math.round(score * 10) / 10, risk_level: level, similarity: Math.round(similarity * 1000) / 1000, lat, lon }
}

function simulateRoute(sLat, sLon, eLat, eLon) {
  const waypoints = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9
    const lat = sLat + (eLat - sLat) * t
    const lon = sLon + (eLon - sLon) * t
    const r = simulateRisk(lat, lon, null)
    return { lat: Math.round(lat * 10000) / 10000, lon: Math.round(lon * 10000) / 10000, risk: r.risk_score }
  })
  const avgRisk = waypoints.reduce((s, w) => s + w.risk, 0) / waypoints.length
  let recommended
  if (avgRisk < 40) recommended = 'SAFE'
  else if (avgRisk < 70) recommended = 'CAUTION'
  else recommended = 'AVOID'
  return { waypoints, average_risk: Math.round(avgRisk * 10) / 10, recommended }
}

const LEVEL_COLOR = { LOW: '#38bdf8', MEDIUM: '#facc15', HIGH: '#f97316', CRITICAL: '#f87171' }
const REC_COLOR = { SAFE: '#34d399', CAUTION: '#facc15', AVOID: '#f87171' }

function RiskMeter({ risk }) {
  if (!risk) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>← 왼쪽에서 좌표를 입력하고 실행하세요</div>
  const color = LEVEL_COLOR[risk.risk_level]
  return (
    <div className="risk-meter">
      <div className="risk-value" style={{ color }}>{risk.risk_score}</div>
      <div className="risk-label" style={{ color }}>위험 등급: {risk.risk_level}</div>
      <div className="risk-bar-bg" style={{ marginTop: '1rem' }}>
        <div className="risk-bar-fill" style={{ width: `${risk.risk_score}%`, background: color }} />
      </div>
      <div className="risk-details">
        <div className="risk-detail-row">
          <span>코사인 유사도</span>
          <span style={{ color }}>{risk.similarity}</span>
        </div>
        <div className="risk-detail-row">
          <span>위도</span>
          <span>{risk.lat}</span>
        </div>
        <div className="risk-detail-row">
          <span>경도</span>
          <span>{risk.lon}</span>
        </div>
      </div>
    </div>
  )
}

function MapViz({ risk, route, lat, lon }) {
  const toMapX = (v, min, max) => ((v - min) / (max - min)) * 85 + 7.5
  const toMapY = (v, min, max) => (1 - (v - min) / (max - min)) * 75 + 12.5

  const allLats = [lat, ...(route?.waypoints.map(w => w.lat) || [])]
  const allLons = [lon, ...(route?.waypoints.map(w => w.lon) || [])]
  const minLat = Math.min(...allLats) - 0.01, maxLat = Math.max(...allLats) + 0.01
  const minLon = Math.min(...allLons) - 0.01, maxLon = Math.max(...allLons) + 0.01

  const mx = toMapX(lon, minLon, maxLon)
  const my = toMapY(lat, minLat, maxLat)
  const color = risk ? LEVEL_COLOR[risk.risk_level] : '#38bdf8'

  return (
    <div className="map-viz" style={{ minHeight: 360 }}>
      <div className="map-grid" />
      <div className="map-title">📍 지도 시각화 (시뮬레이션)</div>
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
        {/* heat zones */}
        {risk && [
          { dx: 0, dy: 0, r: 18, o: 0.15 },
          { dx: 8, dy: -5, r: 12, o: 0.1 },
          { dx: -6, dy: 8, r: 9, o: 0.08 },
        ].map((z, i) => (
          <circle key={i}
            cx={mx + z.dx} cy={my + z.dy} r={z.r}
            fill={color} fillOpacity={z.o}
          />
        ))}

        {/* route line */}
        {route && (() => {
          const pts = route.waypoints.map(w => ({
            x: toMapX(w.lon, minLon, maxLon),
            y: toMapY(w.lat, minLat, maxLat),
            risk: w.risk,
          }))
          return (
            <>
              {pts.slice(0, -1).map((p, i) => {
                const q = pts[i + 1]
                const c = LEVEL_COLOR[
                  p.risk >= 75 ? 'CRITICAL' : p.risk >= 50 ? 'HIGH' : p.risk >= 25 ? 'MEDIUM' : 'LOW'
                ]
                return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={c} strokeWidth="0.8" strokeOpacity="0.9" />
              })}
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="1.2"
                  fill={LEVEL_COLOR[p.risk >= 75 ? 'CRITICAL' : p.risk >= 50 ? 'HIGH' : p.risk >= 25 ? 'MEDIUM' : 'LOW']}
                />
              ))}
              {/* start/end markers */}
              <circle cx={pts[0].x} cy={pts[0].y} r="2.5" fill="#34d399" />
              <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill="#f87171" />
            </>
          )
        })()}

        {/* current location */}
        <circle cx={mx} cy={my} r="3" fill={color} stroke="#0b1120" strokeWidth="0.8" />
        <circle cx={mx} cy={my} r="6" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
      <div className="map-label">
        {risk && <div>🌡️ 현재 위험도: <strong style={{ color }}>{risk.risk_score}</strong></div>}
        {route && <div>🗺️ 경로 평균: <strong style={{ color: REC_COLOR[route.recommended] }}>{route.average_risk}</strong></div>}
        {!risk && !route && <div>데이터를 불러오면 시각화됩니다</div>}
      </div>
    </div>
  )
}

export default function Demo() {
  const [tab, setTab] = useState('risk')
  const [loc, setLoc] = useState(LOCATIONS[0])
  const [customLat, setCustomLat] = useState('')
  const [customLon, setCustomLon] = useState('')
  const [temperature, setTemperature] = useState(32)
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState(null)
  const [endLoc, setEndLoc] = useState(LOCATIONS[1])
  const [route, setRoute] = useState(null)
  const [log, setLog] = useState([])

  const addLog = (msg, type = 'info') => setLog(l => [...l.slice(-6), { msg, type, id: Date.now() }])

  const getLat = () => customLat !== '' ? Number(customLat) : loc.lat
  const getLon = () => customLon !== '' ? Number(customLon) : loc.lon

  const runRisk = async () => {
    const lat = getLat(), lon = getLon()
    setLoading(true)
    addLog(`POST /api/risk { lat: ${lat}, lon: ${lon}, temperature: ${temperature} }`)
    await new Promise(r => setTimeout(r, 800))
    const result = simulateRisk(lat, lon, temperature)
    setRisk(result)
    addLog(`← 200 OK { risk_score: ${result.risk_score}, risk_level: "${result.risk_level}" }`, 'success')
    setLoading(false)
  }

  const runRoute = async () => {
    const lat = getLat(), lon = getLon()
    setLoading(true)
    addLog(`POST /api/route { start: [${lat},${lon}], end: [${endLoc.lat},${endLoc.lon}] }`)
    await new Promise(r => setTimeout(r, 1200))
    const result = simulateRoute(lat, lon, endLoc.lat, endLoc.lon)
    setRoute(result)
    addLog(`← 200 OK { average_risk: ${result.average_risk}, recommended: "${result.recommended}" }`, 'success')
    setLoading(false)
  }

  return (
    <div className="demo-layout">
      <div className="section-title">🔬 인터랙티브 데모</div>
      <div className="section-sub">실제 API와 동일한 로직으로 시뮬레이션합니다. 백엔드 없이도 체험 가능합니다.</div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[{ id: 'risk', label: '🌡️ 위험도 예측' }, { id: 'route', label: '🗺️ 경로 분석' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="demo-grid">
        {/* Left panel */}
        <div>
          <div className="demo-panel">
            <h3>입력 파라미터</h3>

            <div className="form-field">
              <label>위치 선택</label>
              <select value={loc.name} onChange={e => {
                const found = LOCATIONS.find(l => l.name === e.target.value)
                if (found) { setLoc(found); setCustomLat(''); setCustomLon('') }
              }}>
                {LOCATIONS.map(l => <option key={l.name}>{l.name}</option>)}
                <option value="custom">직접 입력</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>위도 (lat)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat !== '' ? customLat : loc.lat}
                  onChange={e => setCustomLat(e.target.value)}
                  placeholder="37.5665"
                />
              </div>
              <div className="form-field">
                <label>경도 (lon)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLon !== '' ? customLon : loc.lon}
                  onChange={e => setCustomLon(e.target.value)}
                  placeholder="126.978"
                />
              </div>
            </div>

            <div className="form-field">
              <label>현재 기온 (°C)</label>
              <input
                type="range"
                min="15"
                max="42"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--accent)' }}>{temperature}°C</div>
            </div>

            {tab === 'route' && (
              <div className="form-field">
                <label>목적지</label>
                <select value={endLoc.name} onChange={e => {
                  const found = LOCATIONS.find(l => l.name === e.target.value)
                  if (found) setEndLoc(found)
                }}>
                  {LOCATIONS.map(l => <option key={l.name}>{l.name}</option>)}
                </select>
              </div>
            )}

            <button
              className="run-btn"
              disabled={loading}
              onClick={tab === 'risk' ? runRisk : runRoute}
            >
              {loading ? '⏳ 분석 중...' : tab === 'risk' ? '🌡️ 위험도 분석 실행' : '🗺️ 경로 분석 실행'}
            </button>
          </div>

          {/* API Log */}
          <div className="demo-panel" style={{ marginTop: '1rem' }}>
            <h3>API 로그</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.7 }}>
              {log.length === 0 && <div style={{ color: 'var(--muted)' }}>아직 요청이 없습니다</div>}
              {log.map(l => (
                <div key={l.id} style={{ color: l.type === 'success' ? 'var(--green)' : 'var(--muted)' }}>
                  {l.type === 'success' ? '✓' : '→'} {l.msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="demo-panel">
            {tab === 'risk' ? (
              <>
                <h3>위험도 결과</h3>
                <RiskMeter risk={risk} />
              </>
            ) : (
              <>
                <h3>경로 분석 결과</h3>
                {route ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                      <div>
                        <div className="risk-value" style={{ color: REC_COLOR[route.recommended] }}>{route.average_risk}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>평균 위험도</div>
                      </div>
                      <div style={{ padding: '0.5rem 1rem', borderRadius: 8, background: `rgba(${route.recommended === 'SAFE' ? '52,211,153' : route.recommended === 'CAUTION' ? '250,204,21' : '248,113,113'},0.1)`, border: `1px solid ${REC_COLOR[route.recommended]}`, color: REC_COLOR[route.recommended], fontWeight: 700 }}>
                        {route.recommended === 'SAFE' ? '✅ 이동 안전' : route.recommended === 'CAUTION' ? '⚠️ 주의 필요' : '🚫 이동 자제'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>구간별 위험도</div>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: 60 }}>
                      {route.waypoints.map((w, i) => {
                        const h = Math.max(4, (w.risk / 100) * 60)
                        const c = LEVEL_COLOR[w.risk >= 75 ? 'CRITICAL' : w.risk >= 50 ? 'HIGH' : w.risk >= 25 ? 'MEDIUM' : 'LOW']
                        return (
                          <div key={i} title={`구간 ${i+1}: ${w.risk}`}
                            style={{ flex: 1, height: h, background: c, borderRadius: '2px 2px 0 0', opacity: 0.85 }}
                          />
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      <span>출발</span><span>도착</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>← 왼쪽에서 경로를 설정하고 실행하세요</div>
                )}
              </>
            )}
          </div>

          <MapViz risk={risk} route={route} lat={getLat()} lon={getLon()} />
        </div>
      </div>
    </div>
  )
}
