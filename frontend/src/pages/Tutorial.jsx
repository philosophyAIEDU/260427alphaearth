import { useState } from 'react'

const steps = [
  {
    id: 0,
    icon: '🌍',
    title: 'AlphaEarth란?',
    content: () => (
      <div className="step-body">
        <p>
          <strong>AlphaEarth</strong>는 위성 이미지 임베딩(Satellite Image Embedding)과
          AI 기반 기후 예측 모델을 결합하여 지구 표면의 열 위험도를 실시간으로 분석하는 플랫폼입니다.
        </p>

        <h3>🎯 무엇을 해결하나요?</h3>
        <p>
          대한민국은 매년 여름 폭염으로 인한 온열질환자가 급증합니다.
          AlphaEarth는 임의의 GPS 좌표를 입력하면 해당 위치의 열 위험도를
          <strong> 0~100 점수</strong>로 즉시 제공합니다.
        </p>

        <div className="info-box">
          💡 AlphaFold가 단백질 구조를 예측하듯, AlphaEarth는 지구 표면의 열 위험 패턴을 예측합니다.
        </div>

        <h3>🧩 핵심 구성 요소</h3>
        <ul>
          <li><strong>임베딩 서비스</strong> — Google Earth Engine 위성 이미지를 128차원 벡터로 변환</li>
          <li><strong>위험도 모델</strong> — 코사인 유사도로 현재 위치와 고위험 패턴을 비교</li>
          <li><strong>기상 통합</strong> — WeatherNext API로 현재 기온을 위험 점수에 반영</li>
          <li><strong>경로 분석</strong> — 이동 경로를 10개 구간으로 샘플링해 평균 위험도 계산</li>
        </ul>

        <h3>🏗️ 기술 스택</h3>
        <div className="code-block">
          <span className="cmt"># Backend</span>{'\n'}
          <span className="var">FastAPI</span> + <span className="var">Python 3.11</span>{'\n'}
          <span className="var">numpy</span> · <span className="var">scikit-learn</span> · <span className="var">httpx</span>{'\n\n'}
          <span className="cmt"># Frontend</span>{'\n'}
          <span className="var">React 18</span> + <span className="var">Vite</span>{'\n'}
          <span className="var">Mapbox GL JS</span> · <span className="var">PWA</span>
        </div>
      </div>
    ),
  },
  {
    id: 1,
    icon: '📡',
    title: '위성 임베딩 이해하기',
    content: () => (
      <div className="step-body">
        <p>
          AlphaEarth의 핵심은 <strong>위성 이미지 임베딩</strong>입니다.
          특정 좌표의 지표면 특성을 숫자 벡터로 표현하여 AI가 처리할 수 있게 만듭니다.
        </p>

        <h3>📊 임베딩이란?</h3>
        <p>
          임베딩은 복잡한 데이터(이미지, 텍스트 등)를 고정 크기의 숫자 배열로 압축하는 기법입니다.
          AlphaEarth는 위성 이미지의 <strong>128차원 벡터</strong>를 생성합니다.
        </p>

        <div className="code-block">
          <span className="cmt"># 임베딩 예시: 서울 광화문 좌표</span>{'\n'}
          <span className="var">embedding</span> = [{'\n'}
          {'  '}<span className="num">0.23</span>, <span className="num">-0.15</span>, <span className="num">0.87</span>, <span className="num">0.42</span>,{'\n'}
          {'  '}<span className="cmt">... (총 128개 값)</span>{'\n'}
          ]
        </div>

        <h3>🌡️ 열 특성 추출 요소</h3>
        <ul>
          <li><strong>지표면 온도(LST)</strong> — 실제 지표면의 열 복사 에너지</li>
          <li><strong>불투수면 비율</strong> — 아스팔트·콘크리트 등 열 흡수 표면 비율</li>
          <li><strong>식생 지수(NDVI)</strong> — 녹지 면적 (높을수록 쿨링 효과)</li>
          <li><strong>건물 밀도</strong> — 도시 열섬 효과 관련 지표</li>
        </ul>

        <h3>💻 API 코드 예시</h3>
        <div className="code-block">
          <span className="kw">import</span> <span className="var">httpx</span>{'\n\n'}
          <span className="cmt"># 임베딩 서비스 직접 호출</span>{'\n'}
          <span className="var">response</span> = <span className="var">httpx</span>.<span className="fn">get</span>({'\n'}
          {'  '}<span className="str">"http://your-backend/api/embedding"</span>,{'\n'}
          {'  '}<span className="var">params</span>=&#123;<span className="str">"lat"</span>: <span className="num">37.5665</span>, <span className="str">"lon"</span>: <span className="num">126.978</span>&#125;{'\n'}
          ){'\n'}
          <span className="var">vector</span> = <span className="var">response</span>.<span className="fn">json</span>()[<span className="str">"embedding"</span>]
        </div>

        <div className="warn-box">
          ⚠️ 현재 MVP에서는 실제 GEE 연결 대신 시뮬레이션 임베딩을 사용합니다.
          프로덕션 배포 시 GEE 서비스 계정 키가 필요합니다.
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: '🌡️',
    title: '열 위험도 예측 API',
    content: () => (
      <div className="step-body">
        <p>
          <strong>POST /api/risk</strong> 엔드포인트는 좌표와 선택적 기상 데이터를 받아
          열 위험 점수를 반환합니다.
        </p>

        <h3>📤 요청 형식</h3>
        <div className="code-block">
          <span className="cmt"># Python 예시</span>{'\n'}
          <span className="kw">import</span> <span className="var">requests</span>{'\n\n'}
          <span className="var">payload</span> = &#123;{'\n'}
          {'  '}<span className="str">"lat"</span>: <span className="num">37.5665</span>,   <span className="cmt"># 위도 (서울 시청)</span>{'\n'}
          {'  '}<span className="str">"lon"</span>: <span className="num">126.9780</span>,  <span className="cmt"># 경도</span>{'\n'}
          {'  '}<span className="str">"temperature"</span>: <span className="num">35.0</span>  <span className="cmt"># 현재 기온 (옵션)</span>{'\n'}
          &#125;{'\n\n'}
          <span className="var">res</span> = <span className="var">requests</span>.<span className="fn">post</span>({'\n'}
          {'  '}<span className="str">"https://your-api.com/api/risk"</span>,{'\n'}
          {'  '}<span className="var">json</span>=<span className="var">payload</span>{'\n'}
          ){'\n'}
          <span className="var">data</span> = <span className="var">res</span>.<span className="fn">json</span>()
        </div>

        <h3>📥 응답 형식</h3>
        <div className="code-block">
          &#123;{'\n'}
          {'  '}<span className="str">"risk_score"</span>: <span className="num">72.4</span>,      <span className="cmt"># 0~100 열 위험 점수</span>{'\n'}
          {'  '}<span className="str">"risk_level"</span>: <span className="str">"HIGH"</span>,    <span className="cmt"># LOW / MEDIUM / HIGH / CRITICAL</span>{'\n'}
          {'  '}<span className="str">"similarity"</span>: <span className="num">0.847</span>,     <span className="cmt"># 고위험 패턴과의 코사인 유사도</span>{'\n'}
          {'  '}<span className="str">"lat"</span>: <span className="num">37.5665</span>,{'\n'}
          {'  '}<span className="str">"lon"</span>: <span className="num">126.978</span>{'\n'}
          &#125;
        </div>

        <h3>🎯 위험 등급 기준</h3>
        <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'LOW', range: '0~24', color: 'var(--accent)' },
            { label: 'MEDIUM', range: '25~49', color: 'var(--yellow)' },
            { label: 'HIGH', range: '50~74', color: 'var(--orange)' },
            { label: 'CRITICAL', range: '75~100', color: 'var(--red)' },
          ].map(g => (
            <div key={g.label} className="card" style={{ borderColor: g.color, padding: '0.9rem' }}>
              <div style={{ color: g.color, fontWeight: 700 }}>{g.label}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{g.range}점</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: '🗺️',
    title: '경로 위험 분석 API',
    content: () => (
      <div className="step-body">
        <p>
          <strong>POST /api/route</strong>는 출발지에서 목적지까지의 경로를 10개 구간으로
          나누어 각 지점의 열 위험도를 분석하고 이동 권장 여부를 반환합니다.
        </p>

        <h3>📤 요청 형식</h3>
        <div className="code-block">
          <span className="var">payload</span> = &#123;{'\n'}
          {'  '}<span className="str">"start_lat"</span>: <span className="num">37.5665</span>,  <span className="cmt"># 출발지 위도</span>{'\n'}
          {'  '}<span className="str">"start_lon"</span>: <span className="num">126.9780</span>, <span className="cmt"># 출발지 경도</span>{'\n'}
          {'  '}<span className="str">"end_lat"</span>: <span className="num">37.5700</span>,    <span className="cmt"># 목적지 위도</span>{'\n'}
          {'  '}<span className="str">"end_lon"</span>: <span className="num">127.0200</span>    <span className="cmt"># 목적지 경도</span>{'\n'}
          &#125;
        </div>

        <h3>📥 응답 형식</h3>
        <div className="code-block">
          &#123;{'\n'}
          {'  '}<span className="str">"waypoints"</span>: [{'\n'}
          {'    '}&#123; <span className="str">"lat"</span>: <span className="num">37.566</span>, <span className="str">"lon"</span>: <span className="num">126.979</span>, <span className="str">"risk"</span>: <span className="num">45.2</span> &#125;,{'\n'}
          {'    '}&#123; <span className="str">"lat"</span>: <span className="num">37.567</span>, <span className="str">"lon"</span>: <span className="num">126.984</span>, <span className="str">"risk"</span>: <span className="num">62.1</span> &#125;,{'\n'}
          {'    '}<span className="cmt">... (총 10개 구간)</span>{'\n'}
          {'  '}],{'\n'}
          {'  '}<span className="str">"average_risk"</span>: <span className="num">54.7</span>,     <span className="cmt"># 경로 평균 위험도</span>{'\n'}
          {'  '}<span className="str">"recommended"</span>: <span className="str">"CAUTION"</span>  <span className="cmt"># SAFE / CAUTION / AVOID</span>{'\n'}
          &#125;
        </div>

        <h3>🚦 이동 권고 기준</h3>
        <ul>
          <li><strong style={{ color: 'var(--green)' }}>SAFE</strong> — 평균 위험도 40 미만: 이동 안전</li>
          <li><strong style={{ color: 'var(--yellow)' }}>CAUTION</strong> — 40~69: 충분한 수분 섭취 권장</li>
          <li><strong style={{ color: 'var(--red)' }}>AVOID</strong> — 70 이상: 이동 자제 권고</li>
        </ul>

        <div className="info-box">
          💡 경로는 직선으로 10등분하여 각 지점을 독립적으로 분석합니다.
          도로 네트워크 기반 경로는 향후 업데이트에서 지원 예정입니다.
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: '🚀',
    title: '배포 & 설정',
    content: () => (
      <div className="step-body">
        <p>
          AlphaEarth는 프론트엔드(Netlify)와 백엔드(Render/Heroku)를 분리하여 배포합니다.
        </p>

        <h3>1️⃣ 백엔드 배포 (Render)</h3>
        <div className="code-block">
          <span className="cmt"># 1. 저장소 복제</span>{'\n'}
          <span className="fn">git clone</span> <span className="str">https://github.com/your/alphaearth.git</span>{'\n\n'}
          <span className="cmt"># 2. 백엔드 의존성 설치</span>{'\n'}
          <span className="fn">cd</span> backend{'\n'}
          <span className="fn">pip install</span> -r requirements.txt{'\n\n'}
          <span className="cmt"># 3. 로컬 실행</span>{'\n'}
          <span className="fn">uvicorn</span> app.main:app --reload --port 8000
        </div>

        <h3>2️⃣ 프론트엔드 배포 (Netlify)</h3>
        <div className="code-block">
          <span className="cmt"># 환경 변수 설정 (Netlify 대시보드)</span>{'\n'}
          <span className="var">VITE_API_BASE</span>=<span className="str">https://your-backend.onrender.com/api</span>{'\n'}
          <span className="var">VITE_MAPBOX_TOKEN</span>=<span className="str">pk.eyJ1Ijoi...</span>{'\n\n'}
          <span className="cmt"># 빌드 설정 (netlify.toml에 이미 구성됨)</span>{'\n'}
          <span className="var">Build command</span>: <span className="fn">npm run build</span>{'\n'}
          <span className="var">Publish directory</span>: <span className="str">frontend/dist</span>
        </div>

        <h3>3️⃣ 환경 변수 목록</h3>
        <div className="cards-grid" style={{ gridTemplateColumns: '1fr', gap: '0.6rem' }}>
          {[
            { key: 'VITE_API_BASE', desc: '백엔드 API 기본 URL (예: https://api.example.com/api)', req: true },
            { key: 'VITE_MAPBOX_TOKEN', desc: 'Mapbox 지도 표시용 액세스 토큰', req: true },
            { key: 'GEE_SERVICE_ACCOUNT', desc: 'Google Earth Engine 서비스 계정 이메일', req: false },
            { key: 'GEE_PRIVATE_KEY', desc: 'GEE 서비스 계정 개인 키 (JSON)', req: false },
          ].map(v => (
            <div key={v.key} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <code style={{ color: 'var(--accent)', fontSize: '0.85rem', minWidth: 200 }}>{v.key}</code>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{v.desc}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4, background: v.req ? 'rgba(248,113,113,0.1)' : 'rgba(148,163,184,0.1)', color: v.req ? 'var(--red)' : 'var(--muted)' }}>
                {v.req ? '필수' : '선택'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

export default function Tutorial() {
  const [active, setActive] = useState(0)
  const Step = steps[active]

  return (
    <div className="tut-layout">
      <aside className="tut-sidebar">
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          목차
        </div>
        <nav className="tut-nav">
          {steps.map(s => (
            <button
              key={s.id}
              className={active === s.id ? 'active' : ''}
              onClick={() => setActive(s.id)}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="tut-content">
        <div className="tut-step" key={active}>
          <div className="step-header">
            <div className="step-num">{active + 1}</div>
            <h2>{Step.icon} {Step.title}</h2>
          </div>
          <Step.content />
          <div className="step-nav">
            <button
              className="btn btn-outline"
              onClick={() => setActive(a => a - 1)}
              disabled={active === 0}
              style={{ opacity: active === 0 ? 0.3 : 1 }}
            >
              ← 이전
            </button>
            {active < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setActive(a => a + 1)}>
                다음 →
              </button>
            ) : (
              <a href="/demo" className="btn btn-primary">데모 체험하기 →</a>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
