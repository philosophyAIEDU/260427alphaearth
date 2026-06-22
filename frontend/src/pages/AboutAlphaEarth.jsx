import { useState } from 'react'

const steps = [
  {
    icon: '🛰️',
    title: '위성이 사진을 잔뜩 찍어요',
    desc: '인공위성, 레이더, 기상 센서가 같은 장소를 1년 동안 수십 번 촬영해요. 사진이 너무 많아서 사람이 다 보기 힘들 정도예요!',
  },
  {
    icon: '🧠',
    title: 'AI가 사진을 "요약"해요',
    desc: 'AlphaEarth라는 AI가 그 많은 사진을 보고 "이 장소는 어떤 곳인가"를 64개의 숫자로 요약해요. 마치 긴 책을 한 문장으로 줄이는 것처럼요!',
  },
  {
    icon: '🔢',
    title: '숫자 카드를 만들어요',
    desc: '지구를 작은 칸(10m × 10m)으로 나눠서, 칸마다 64개 숫자가 적힌 "정보 카드"를 붙여요. 이 카드를 임베딩(embedding)이라고 불러요.',
  },
  {
    icon: '🔍',
    title: '비슷한 곳을 쉽게 찾아요',
    desc: '숫자 카드가 비슷하면 비슷한 환경이에요! 그래서 "서울과 닮은 도시 찾기", "숲이 도시로 변한 곳 찾기" 같은 걸 아주 빠르게 할 수 있어요.',
  },
]

const whatCanDo = [
  { emoji: '🔍', title: '비슷한 지역 찾기', desc: '서울과 환경이 닮은 전 세계 지역을 즉시 찾아요' },
  { emoji: '🏗️', title: '변화 탐지', desc: '작년과 올해 숫자 카드를 비교해 무엇이 바뀌었는지 알아요' },
  { emoji: '🗺️', title: '토지 분류', desc: '적은 예시만으로 숲·논·도시·물을 자동 분류해요' },
  { emoji: '⚡', title: '빠른 분석', desc: '무거운 위성 사진 대신 가벼운 숫자만 다뤄서 훨씬 빨라요' },
]

const quiz = [
  {
    q: 'AlphaEarth는 무엇을 만드는 AI인가요?',
    options: ['위성 사진을 64개의 숫자(임베딩)로 요약해요', '날씨를 예보해요', '게임 캐릭터를 만들어요'],
    answer: 0,
    explain: 'AlphaEarth는 Google DeepMind가 만든 AI로, 1년치 위성·레이더·기상 데이터를 모아 한 장소를 64개 숫자로 요약(임베딩)해요!',
  },
  {
    q: 'AlphaEarth와 Google Earth Engine의 관계로 맞는 것은?',
    options: ['완전히 같은 거예요', 'AlphaEarth는 GEE 안에서 쓰는 데이터(재료)예요', 'AlphaEarth가 GEE보다 더 큰 거예요'],
    answer: 1,
    explain: 'GEE는 분석하는 도구(주방), AlphaEarth는 그 안에서 꺼내 쓰는 AI 데이터(특별한 재료)예요. GEE가 더 큰 개념이에요!',
  },
  {
    q: '"숫자 카드(임베딩)가 비슷하다"는 것은 무슨 뜻일까요?',
    options: ['두 장소의 사진 색이 같다', '두 장소의 환경이 비슷하다', '두 장소가 가깝다'],
    answer: 1,
    explain: '임베딩이 비슷하면 환경이 비슷하다는 뜻이에요. 그래서 멀리 떨어져 있어도 닮은 지역을 찾을 수 있어요!',
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

const EXAMPLE_CODE = `// AlphaEarth 위성 임베딩 데이터셋 불러오기
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
  .filterDate('2023-01-01', '2024-01-01')
  .mosaic();   // 64개 밴드 = 64개의 "요약 숫자"

var seoul = ee.Geometry.Point([126.978, 37.566]);
Map.centerObject(seoul, 6);

// 서울의 "숫자 카드(임베딩)" 추출
var seoulVec = embeddings.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: seoul.buffer(1000),
  scale: 10
}).toArray();

// 모든 지역과 서울을 비교 (숫자가 닮을수록 높은 점수)
var seoulImg = ee.Image.constant(seoulVec)
  .arrayFlatten([embeddings.bandNames()]);
var similarity = embeddings.multiply(seoulImg)
  .reduce(ee.Reducer.sum())
  .rename('similarity');

// 서울과 닮은 곳일수록 밝게 표시
Map.addLayer(similarity, {
  min: 0, max: 1,
  palette: ['#000004', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf']
}, '서울과 닮은 지역');
print('서울의 숫자 카드를 추출했어요!');`

export default function AboutAlphaEarth() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(EXAMPLE_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 2rem', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(129,140,248,0.12), transparent)', borderRadius: 20, marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
          AlphaEarth가 뭐예요?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
          초등학생도 이해할 수 있게 쉽게 설명해드릴게요! 😊
        </p>
      </div>

      {/* 한 줄 정의 */}
      <div style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(56,189,248,0.1))', border: '1px solid rgba(129,140,248,0.25)', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.5 }}>
          🧠 AlphaEarth = <span style={{ color: '#818cf8' }}>위성 사진을 숫자로 요약하는 AI</span>
        </div>
        <div style={{ color: 'var(--muted)', marginTop: '0.75rem', fontSize: '1rem', lineHeight: 1.7 }}>
          구글 딥마인드(Google DeepMind)가 2024년에 만든 AI예요.<br />
          1년 동안 찍은 위성 사진을 모아서 <strong style={{ color: 'var(--text)' }}>한 장소를 64개의 숫자</strong>로 요약해줘요.
        </div>
      </div>

      {/* GEE와의 관계 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🍳 Earth Engine과 무슨 관계예요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          헷갈리기 쉬운데, 둘은 <strong style={{ color: 'var(--text)' }}>다른 것</strong>이에요. 요리에 비유해볼게요!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--bg2)', border: '2px solid var(--accent)', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌍🍳</div>
            <div style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>Google Earth Engine</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.3rem' }}>= 주방 (요리하는 곳)</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>위성 데이터를 분석하는 도구예요. 여기서 코드로 요리를 해요.</div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '2px solid #818cf8', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠🥕</div>
            <div style={{ fontWeight: 800, color: '#818cf8', marginBottom: '0.5rem' }}>AlphaEarth</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.3rem' }}>= 특별한 재료</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>주방에서 꺼내 쓰는 AI가 만든 똑똑한 데이터예요.</div>
          </div>
        </div>
        <div className="info-box" style={{ marginTop: '1rem' }}>
          💡 즉, <strong>AlphaEarth는 Earth Engine이라는 주방 안에서 꺼내 쓰는 재료</strong>예요.
          요리(분석)는 Earth Engine에서 하고, 그때 AlphaEarth라는 좋은 재료를 쓰면 더 똑똑한 분석을 할 수 있어요!
        </div>
      </section>

      {/* 작동 4단계 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🔍 AlphaEarth는 어떻게 작동해요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>4단계로 알아봐요!</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(129,140,248,0.12)', border: '2px solid #818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8', fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 999 }}>Step {i + 1}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{s.title}</span>
                </div>
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.93rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 임베딩이란 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🔢 "임베딩"이 뭐예요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
          임베딩(embedding)은 <strong style={{ color: 'var(--text)' }}>복잡한 것을 숫자 목록으로 바꾼 것</strong>이에요.
          AlphaEarth는 한 장소를 <strong style={{ color: 'var(--text)' }}>64개 숫자</strong>로 표현해요.
        </p>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>예) 서울 한 칸의 임베딩 카드 🪪</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.82rem' }}>
            {[0.23, -0.15, 0.87, 0.42, -0.31, 0.66, 0.09, -0.52].map((n, i) => (
              <span key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.3rem 0.6rem', color: n >= 0 ? 'var(--accent)' : '#f87171' }}>{n}</span>
            ))}
            <span style={{ background: 'var(--bg3)', border: '1px dashed var(--border)', borderRadius: 6, padding: '0.3rem 0.6rem', color: 'var(--muted)' }}>... 총 64개</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem', lineHeight: 1.6 }}>
            👉 두 장소의 카드가 <strong style={{ color: 'var(--text)' }}>비슷한 숫자</strong>면 환경이 비슷하다는 뜻!
            그래서 "닮은 지역 찾기"가 가능해요.
          </div>
        </div>
      </section>

      {/* 무엇을 할 수 있나 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>✨ AlphaEarth로 뭘 할 수 있어요?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {whatCanDo.map(w => (
            <div key={w.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{w.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{w.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.83rem', lineHeight: 1.5 }}>{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 사용 방법 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🚀 AlphaEarth, 어떻게 써요?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          AlphaEarth는 Earth Engine 안에 <strong style={{ color: 'var(--text)' }}>데이터셋</strong>으로 들어있어요.
          아래 3단계로 누구나 사용할 수 있어요!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { n: '1', t: 'GEE Code Editor 열기', d: 'code.earthengine.google.com 에 접속해요 (무료 계정 필요)' },
            { n: '2', t: '임베딩 데이터셋 불러오기', d: "코드에 ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL') 를 입력해요" },
            { n: '3', t: '숫자를 비교·분석하기', d: '두 지역의 임베딩을 비교하거나, 변화를 찾거나, 분류에 활용해요' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '0.9rem' }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.t}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.86rem', marginTop: '0.2rem', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 예제 코드 */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>📝 예제: 서울과 닮은 지역 찾기</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={copy} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderColor: copied ? 'var(--green)' : undefined, color: copied ? 'var(--green)' : undefined }}>
                {copied ? '✓ 복사됨' : '📋 복사'}
              </button>
              <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener" className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                GEE Editor ↗
              </a>
            </div>
          </div>
          <pre className="code-block" style={{ margin: 0, overflowX: 'auto' }}>
            {EXAMPLE_CODE.split('\n').map((line, i) => {
              let color = '#e2e8f0'
              if (line.trimStart().startsWith('//')) color = '#4b7fa0'
              else if (/^\s*(var|function|return)\b/.test(line)) color = '#c084fc'
              return <div key={i} style={{ color }}>{line || '​'}</div>
            })}
          </pre>
          <div className="info-box" style={{ marginTop: '0.75rem' }}>
            위 코드를 복사해 GEE Code Editor에 붙여넣고 실행하면, 서울과 환경이 닮은 지역이 밝게 표시돼요!
            더 많은 예제는 <a href="/playground" style={{ color: 'var(--accent)' }}>코드 예제 페이지</a>에서 볼 수 있어요.
          </div>
        </div>
      </section>

      {/* 퀴즈 */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>🧩 이해했는지 퀴즈로 확인해요!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>정답을 맞혀보세요 😊</p>
        {quiz.map((item, i) => <QuizCard key={i} item={item} index={i} />)}
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(56,189,248,0.08))', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>이제 직접 써볼까요?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
          코드 예제를 복사하거나, AI에게 원하는 분석을 설명해<br />바로 실행 가능한 코드를 만들어보세요!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/playground" className="btn btn-primary">💻 코드 예제 보기</a>
          <a href="/ai-coder" className="btn btn-outline">🤖 AI 코드 생성</a>
        </div>
      </div>
    </div>
  )
}
