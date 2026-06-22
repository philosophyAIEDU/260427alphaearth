import { useState } from 'react'

const steps = [
  {
    icon: '🛰️',
    title: '우주에서 사진을 찍어요',
    desc: '지구 위 600km 하늘에 떠 있는 인공위성이 매일매일 우리 동네 사진을 찍어요. 구글 지도처럼 위에서 내려다보는 사진이에요!',
  },
  {
    icon: '🤖',
    title: 'AI가 사진을 분석해요',
    desc: '사람 눈에는 그냥 사진처럼 보이지만, AI는 그 안에서 "여기는 아스팔트라 뜨겁겠다", "저기는 나무가 많아서 시원하겠다"를 알아낼 수 있어요.',
  },
  {
    icon: '🌡️',
    title: '뜨거운 곳을 찾아요',
    desc: 'AI가 분석한 결과로 "지금 이 장소가 얼마나 위험한지" 0~100점으로 알려줘요. 100점이면 매우 위험, 0점이면 안전해요!',
  },
  {
    icon: '🗺️',
    title: '안전한 길을 알려줘요',
    desc: '출발지에서 도착지까지 가는 길 중에서 가장 시원하고 안전한 길을 찾아줘요. 마치 내비게이션처럼요!',
  },
]

const comparisons = [
  {
    emoji: '🔬',
    title: 'AlphaFold',
    desc: '단백질 구조를 예측하는 AI예요. 약을 만들 때 도움이 돼요.',
    color: '#818cf8',
  },
  {
    emoji: '🌍',
    title: 'AlphaEarth',
    desc: '지구의 위험한 곳을 찾는 AI예요. 사람들을 폭염에서 지켜줘요.',
    color: '#38bdf8',
  },
]

const funFacts = [
  { icon: '📸', fact: '인공위성은 하루에 지구를 약 15바퀴 돌면서 사진을 찍어요' },
  { icon: '🏙️', fact: '도시(아스팔트, 건물)는 숲보다 최대 10°C 더 뜨거울 수 있어요' },
  { icon: '🌳', fact: '나무 한 그루는 에어컨 10대와 같은 냉각 효과가 있어요' },
  { icon: '💻', fact: 'AlphaEarth는 1초 만에 수천 km²의 위험도를 계산할 수 있어요' },
  { icon: '🛰️', fact: 'Sentinel-2 위성의 사진 해상도는 10m — 버스 크기를 구별할 수 있어요' },
]

const quiz = [
  {
    q: '인공위성이 찍은 사진으로 무엇을 알 수 있을까요?',
    options: ['날씨 예보만 할 수 있어요', '지표면 온도, 식물, 홍수 등 다양한 것을 알 수 있어요', '사람 얼굴을 인식할 수 있어요'],
    answer: 1,
    explain: '위성 사진에는 눈에 보이지 않는 적외선 정보도 담겨 있어서 온도, 식물 상태, 물의 양 등을 분석할 수 있어요!',
  },
  {
    q: 'NDVI는 무엇을 측정하는 숫자일까요?',
    options: ['강수량', '식물(녹지)이 얼마나 많은지', '건물 높이'],
    answer: 1,
    explain: 'NDVI(식생 지수)는 -1~1 사이의 숫자로, 1에 가까울수록 건강한 식물이 많다는 뜻이에요. 숲은 0.8, 도시는 0.1 정도예요.',
  },
  {
    q: '여름에 도시가 숲보다 뜨거운 이유는?',
    options: ['도시에 사람이 많아서', '아스팔트와 콘크리트가 햇빛을 흡수하고 나무가 없어서', '구름이 없어서'],
    answer: 1,
    explain: '아스팔트는 햇빛 에너지를 열로 저장해요. 나무는 수분을 증발시켜 주변을 식혀주는데, 도시엔 나무가 적어서 더 뜨거워요!',
  },
]

function QuizCard({ item, index }) {
  const [selected, setSelected] = useState(null)
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
        Q{index + 1}. {item.q}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {item.options.map((opt, i) => {
          let bg = 'var(--bg3)', border = 'var(--border)', color = 'var(--text)'
          if (selected !== null) {
            if (i === item.answer) { bg = 'rgba(52,211,153,0.1)'; border = 'var(--green)'; color = 'var(--green)' }
            else if (i === selected) { bg = 'rgba(248,113,113,0.1)'; border = 'var(--red)'; color = 'var(--red)' }
          }
          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '0.7rem 1rem', color, textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer', fontSize: '0.93rem', fontFamily: 'inherit', transition: 'all 0.15s' }}
            >
              {['🅐', '🅑', '🅒'][i]} {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: '0.9rem', padding: '0.8rem 1rem', borderRadius: 10, background: selected === item.answer ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${selected === item.answer ? 'var(--green)' : 'var(--red)'}`, fontSize: '0.9rem', lineHeight: 1.6 }}>
          {selected === item.answer ? '🎉 정답이에요! ' : '💡 아쉽지만 틀렸어요. '}
          {item.explain}
        </div>
      )}
    </div>
  )
}

export default function AboutAlphaEarth() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 2rem', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.1), transparent)', borderRadius: 20, marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
          AlphaEarth가 뭐예요?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto', lineHeight: 1.8 }}>
          초등학생도 이해할 수 있게 쉽게 설명해드릴게요! 😊
        </p>
      </div>

      {/* 한 줄 설명 */}
      <div style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.1))', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.4 }}>
          🤖 AlphaEarth = <span style={{ color: 'var(--accent)' }}>우주 카메라</span> + <span style={{ color: '#818cf8' }}>AI 두뇌</span>
        </div>
        <div style={{ color: 'var(--muted)', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.7 }}>
          인공위성이 찍은 사진을 AI가 분석해서<br />
          <strong style={{ color: 'var(--text)' }}>"지금 저 동네, 폭염으로 얼마나 위험한가?"</strong>를 알려주는 시스템이에요.
        </div>
      </div>

      {/* 쉬운 비유 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🩺 지구의 건강을 체크하는 의사예요</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          병원에서 의사 선생님이 체온계로 열을 재듯이,<br />
          AlphaEarth는 위성 사진으로 <strong style={{ color: 'var(--text)' }}>지구의 열을 측정</strong>해요.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>🌡️</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>체온계 → 위성 카메라</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>의사가 체온계로 열을 재듯, 위성이 지표면 온도를 측정해요.</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>진단 → AI 분석</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>의사가 "열이 높으니 위험해요"라고 말하듯, AI가 위험도 점수를 줘요.</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>💊</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>처방 → 안전 경로</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>의사가 약을 처방하듯, AlphaEarth는 시원한 이동 경로를 알려줘요.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 steps */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🔍 AlphaEarth는 어떻게 작동해요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>4단계로 알아봐요!</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(56,189,248,0.12)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: 'rgba(56,189,248,0.12)', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 999 }}>Step {i + 1}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{s.title}</span>
                </div>
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.93rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alpha 시리즈 비교 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🆚 AlphaFold vs AlphaEarth</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>둘 다 "Alpha" 시리즈지만 하는 일이 달라요!</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {comparisons.map(c => (
            <div key={c.title} style={{ background: 'var(--bg2)', border: `2px solid ${c.color}`, borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{c.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c.color, marginBottom: '0.5rem' }}>{c.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="info-box" style={{ marginTop: '1rem' }}>
          💡 AlphaFold는 단백질 구조를 예측해 의학 발전에 기여하고, AlphaEarth는 지구 표면 데이터를 분석해 기후 재난으로부터 사람들을 보호합니다.
        </div>
      </section>

      {/* 위험도 점수 설명 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🌡️ 위험도 점수가 뭐예요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
          AlphaEarth는 모든 장소에 <strong style={{ color: 'var(--text)' }}>0~100 점수</strong>를 줘요. 점수가 높을수록 더 위험해요!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {[
            { range: '0 ~ 24', label: '안전 🟢', color: '#38bdf8', emoji: '😊', desc: '시원해요!\n밖에 나가도 좋아요' },
            { range: '25 ~ 49', label: '보통 🟡', color: '#facc15', emoji: '😐', desc: '조금 더워요\n물 마시세요' },
            { range: '50 ~ 74', label: '위험 🟠', color: '#f97316', emoji: '😰', desc: '많이 더워요\n오래 있으면 위험' },
            { range: '75~100', label: '매우 위험 🔴', color: '#f87171', emoji: '🚨', desc: '매우 위험!\n밖에 나가지 마세요' },
          ].map(g => (
            <div key={g.range} style={{ background: 'var(--bg2)', border: `2px solid ${g.color}`, borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{g.emoji}</div>
              <div style={{ fontWeight: 700, color: g.color, fontSize: '0.85rem' }}>{g.label}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.4rem', lineHeight: 1.5 }}>{g.range}점</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.4rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{g.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fun facts */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>🤩 신기한 사실들</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {funFacts.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.9rem 1.1rem' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{f.icon}</span>
              <span style={{ fontSize: '0.93rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.fact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 퀴즈 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🧩 이해했는지 퀴즈로 확인해요!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>정답을 맞혀보세요 😊</p>
        {quiz.map((item, i) => <QuizCard key={i} item={item} index={i} />)}
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>이제 직접 써볼까요?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
          AI 코드 생성기에서 원하는 분석을 설명하면<br />바로 실행 가능한 코드를 만들어드려요!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/ai-coder" className="btn btn-primary">🤖 AI 코드 생성하기</a>
          <a href="/tutorial" className="btn btn-outline">📚 튜토리얼 보기</a>
        </div>
      </div>
    </div>
  )
}
