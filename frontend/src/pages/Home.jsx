import { Link } from 'react-router-dom'

const features = [
  { icon: '🛰️', title: '위성 이미지 분석', desc: 'Landsat, Sentinel, MODIS 등 수십 년간의 위성 데이터를 클라우드에서 즉시 처리합니다.' },
  { icon: '⏱️', title: '시계열 분석', desc: '특정 지역의 식생, 기온, 토지피복 변화를 수십 년 단위로 추적할 수 있습니다.' },
  { icon: '🌱', title: 'NDVI · 식생 지수', desc: '정규화 식생 지수(NDVI)로 작물 생장, 산림 변화, 사막화를 모니터링합니다.' },
  { icon: '🌡️', title: '지표면 온도(LST)', desc: '열 적외선 밴드로 도시 열섬, 산불 피해, 기후 변화를 분석합니다.' },
  { icon: '🗺️', title: '지형 & 토지피복', desc: 'DEM, SRTM, NLCD 등의 데이터셋으로 지형 분석과 토지 분류를 수행합니다.' },
  { icon: '🤖', title: '머신러닝 분류', desc: 'Random Forest, SVM 등의 내장 ML 알고리즘으로 위성 이미지를 자동 분류합니다.' },
]

const pipeline = [
  { icon: '🔑', step: 'Step 1', title: '계정 등록' },
  { icon: '💻', step: 'Step 2', title: 'Code Editor' },
  { icon: '🛰️', step: 'Step 3', title: '데이터 로드' },
  { icon: '🔬', step: 'Step 4', title: '분석 실행' },
  { icon: '📤', step: 'Step 5', title: '결과 내보내기' },
]

const usecases = [
  { emoji: '🌾', title: '농업 모니터링', desc: '작물 생장 상태 파악, 수확량 예측' },
  { emoji: '🌲', title: '산림 관리', desc: '산림 벌채, 산불 피해 면적 추적' },
  { emoji: '🏙️', title: '도시 열섬', desc: '도시화에 따른 지표면 온도 변화 분석' },
  { emoji: '🌊', title: '수자원 관리', desc: '홍수 범람 범위, 가뭄 지수 모니터링' },
  { emoji: '🏔️', title: '빙하 변화', desc: '빙하 면적 축소, 해수면 상승 추적' },
  { emoji: '🌫️', title: '대기 오염', desc: 'NO₂, PM2.5 농도 시공간 분포 파악' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Google Earth Engine 학습 플랫폼</div>
        <h1>
          위성으로 지구를 읽는<br />
          <span className="hl">Google Earth Engine</span>
        </h1>
        <p>
          수십 년치 위성 이미지를 클라우드에서 단 몇 줄의 코드로 분석하세요.
          단계별 튜토리얼과 인터랙티브 코드 예제로 GEE를 빠르게 익힐 수 있습니다.
        </p>
        <div className="hero-cta">
          <Link to="/tutorial" className="btn btn-primary">📚 튜토리얼 시작</Link>
          <Link to="/playground" className="btn btn-outline">💻 코드 예제 보기</Link>
        </div>
      </section>

      {/* Pipeline */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section">
          <div className="section-title">GEE 시작 흐름</div>
          <div className="section-sub">5단계로 위성 데이터 분석을 시작하세요</div>
          <div className="pipeline">
            {pipeline.map((s, i) => (
              <>
                <div className="pipeline-step" key={s.step}>
                  <div className="p-icon">{s.icon}</div>
                  <div className="p-label">{s.step}</div>
                  <div className="p-title">{s.title}</div>
                </div>
                {i < pipeline.length - 1 && <div className="pipeline-arrow" key={`a${i}`}>→</div>}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div className="section-title">GEE의 핵심 기능</div>
        <div className="section-sub">클라우드 기반 지구 관측 플랫폼이 제공하는 강력한 분석 도구</div>
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

      {/* Use cases */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section">
          <div className="section-title">활용 분야</div>
          <div className="section-sub">전 세계 연구자와 기관이 GEE로 해결하는 문제들</div>
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {usecases.map(u => (
              <div className="card" key={u.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{u.emoji}</div>
                <h3 style={{ fontSize: '0.95rem' }}>{u.title}</h3>
                <p style={{ fontSize: '0.85rem' }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="section-title">지금 바로 시작하세요</div>
        <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          GEE 계정이 없어도 괜찮습니다. 튜토리얼을 먼저 읽고
          코드 플레이그라운드에서 예제를 복사해 Code Editor에 바로 붙여넣으세요.
        </p>
        <div className="hero-cta">
          <Link to="/tutorial" className="btn btn-primary">📚 튜토리얼 시작하기</Link>
          <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener" className="btn btn-outline">
            🌍 GEE Code Editor 열기 ↗
          </a>
        </div>
      </div>

      <footer className="footer">
        <p>Google Earth Engine 학습 플랫폼 · 위성 데이터로 지구를 분석하세요</p>
        <p style={{ marginTop: '0.25rem' }}>
          공식 사이트: <a href="https://earthengine.google.com" target="_blank" rel="noopener">earthengine.google.com</a>
          &nbsp;·&nbsp;
          <a href="https://developers.google.com/earth-engine" target="_blank" rel="noopener">공식 문서</a>
        </p>
      </footer>
    </div>
  )
}
