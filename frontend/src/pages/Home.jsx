import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🛰️',
    title: '위성 이미지 임베딩',
    desc: 'Google Earth Engine의 위성 데이터를 AI 임베딩 벡터로 변환해 지구 표면의 열 특성을 정밀하게 파악합니다.',
  },
  {
    icon: '🌡️',
    title: '열 위험도 예측',
    desc: '코사인 유사도 기반 알고리즘으로 임의 좌표의 열 위험 점수(0~100)와 위험 등급을 실시간으로 계산합니다.',
  },
  {
    icon: '🗺️',
    title: '경로 위험 분석',
    desc: '출발지에서 목적지까지의 경로를 분석하여 구간별 열 위험도와 안전 이동 권고 여부를 제공합니다.',
  },
  {
    icon: '☁️',
    title: 'WeatherNext 통합',
    desc: '기상 예보 데이터를 임베딩 모델과 결합해 현재 기온 기반의 보정된 위험 점수를 산출합니다.',
  },
  {
    icon: '📡',
    title: 'REST API',
    desc: 'FastAPI 기반의 REST API로 어떤 서비스에도 쉽게 통합할 수 있습니다. /api/risk, /api/route 엔드포인트 제공.',
  },
  {
    icon: '📱',
    title: 'PWA 지원',
    desc: '프로그레시브 웹 앱으로 오프라인에서도 작동하며, 모바일 기기에서 네이티브 앱처럼 설치할 수 있습니다.',
  },
]

const pipeline = [
  { icon: '📍', step: 'Step 1', title: '좌표 입력' },
  { icon: '🛰️', step: 'Step 2', title: 'GEE 임베딩' },
  { icon: '🧠', step: 'Step 3', title: 'AI 분석' },
  { icon: '🌡️', step: 'Step 4', title: '위험 점수' },
  { icon: '🗺️', step: 'Step 5', title: '지도 시각화' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">AI 재난 예방 플랫폼 · Korea MVP</div>
        <h1>
          <span className="hl">AlphaEarth</span>로<br />
          열 재난을 예측하다
        </h1>
        <p>
          위성 이미지 임베딩과 AI 기반 기후 모델을 결합하여 대한민국 어디서나
          실시간 열 위험도를 분석하고 안전한 이동 경로를 안내합니다.
        </p>
        <div className="hero-cta">
          <Link to="/tutorial" className="btn btn-primary">📚 튜토리얼 시작</Link>
          <Link to="/demo" className="btn btn-outline">🔬 데모 체험</Link>
        </div>
      </section>

      {/* How it works */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section">
          <div className="section-title">어떻게 작동하나요?</div>
          <div className="section-sub">5단계 파이프라인으로 위성 데이터를 열 위험 점수로 변환합니다</div>
          <div className="pipeline">
            {pipeline.map((s, i) => (
              <>
                <div className="pipeline-step" key={s.step}>
                  <div className="p-icon">{s.icon}</div>
                  <div className="p-label">{s.step}</div>
                  <div className="p-title">{s.title}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="pipeline-arrow" key={`arr${i}`}>→</div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div className="section-title">주요 기능</div>
        <div className="section-sub">AlphaEarth가 제공하는 핵심 기능들</div>
        <div className="cards-grid">
          {features.map(f => (
            <div className="card" key={f.title}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="section" style={{ textAlign: 'center' }}>
          <div className="section-title">지금 바로 시작하세요</div>
          <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto 2rem' }}>
            단계별 튜토리얼로 AlphaEarth의 모든 기능을 배우고,
            인터랙티브 데모와 실습 문제로 실력을 확인하세요.
          </p>
          <div className="hero-cta">
            <Link to="/tutorial" className="btn btn-primary">📚 튜토리얼 시작하기</Link>
            <Link to="/practice" className="btn btn-outline">✏️ 실습 문제 풀기</Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>AlphaEarth · AI 기반 열 재난 예방 플랫폼 · Korea MVP</p>
        <p style={{ marginTop: '0.25rem' }}>Built with FastAPI, React, Google Earth Engine, WeatherNext</p>
      </footer>
    </div>
  )
}
