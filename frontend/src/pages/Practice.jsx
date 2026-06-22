import { useState } from 'react'

const quizzes = [
  {
    id: 1,
    question: 'AlphaEarth에서 위험도 점수가 75 이상일 때의 위험 등급은?',
    options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    answer: 3,
    explanation: '위험도 점수 75~100은 CRITICAL 등급입니다. 즉각적인 열 위험이 있는 상태로, 이동을 자제해야 합니다.',
  },
  {
    id: 2,
    question: '위성 임베딩에서 NDVI(정규화 식생 지수)가 높을수록 어떤 효과가 있나요?',
    options: ['열 위험도 증가', '쿨링 효과 (열 위험도 감소)', '위험도에 영향 없음', '임베딩 오류 발생'],
    answer: 1,
    explanation: 'NDVI는 식생(녹지) 면적을 나타냅니다. 녹지가 많을수록 증산 작용으로 쿨링 효과가 있어 열 위험도가 감소합니다.',
  },
  {
    id: 3,
    question: 'POST /api/route 응답의 "recommended" 값이 "AVOID"가 되는 평균 위험도 기준은?',
    options: ['40 이상', '50 이상', '60 이상', '70 이상'],
    answer: 3,
    explanation: '경로 평균 위험도가 70 이상이면 AVOID(이동 자제)가 권고됩니다. 40~69는 CAUTION, 40 미만은 SAFE입니다.',
  },
  {
    id: 4,
    question: 'AlphaEarth 임베딩 벡터의 차원 수는?',
    options: ['32차원', '64차원', '128차원', '256차원'],
    answer: 2,
    explanation: 'AlphaEarth는 위성 이미지를 128차원 벡터로 인코딩합니다. 이 벡터를 사용해 코사인 유사도로 위험 패턴을 비교합니다.',
  },
  {
    id: 5,
    question: '/api/route는 경로를 몇 개의 구간으로 샘플링하나요?',
    options: ['5개', '8개', '10개', '20개'],
    answer: 2,
    explanation: '현재 MVP에서는 출발지-목적지 사이를 직선으로 10등분하여 각 지점의 위험도를 독립적으로 분석합니다.',
  },
  {
    id: 6,
    question: 'AlphaEarth 프론트엔드를 Netlify에 배포할 때 반드시 필요한 환경 변수는?',
    options: [
      'VITE_API_BASE 만',
      'VITE_MAPBOX_TOKEN 만',
      'VITE_API_BASE 와 VITE_MAPBOX_TOKEN 모두',
      'GEE_SERVICE_ACCOUNT 만',
    ],
    answer: 2,
    explanation: '프론트엔드 배포에는 백엔드 URL (VITE_API_BASE)과 지도 표시를 위한 Mapbox 토큰 (VITE_MAPBOX_TOKEN) 모두 필요합니다.',
  },
]

const CODING_TASKS = [
  {
    id: 'c1',
    title: '열 위험도 API 호출 코드 완성',
    description: '아래 Python 코드에서 빈칸을 채워 /api/risk 엔드포인트를 올바르게 호출하세요.',
    template: `import requests

def get_heat_risk(lat, lon, temperature=None):
    payload = {
        "lat": ___,        # 위도 값
        "lon": ___,        # 경도 값
    }
    if temperature:
        payload["___"] = temperature

    response = requests.post(
        "https://api.alphaearth.ai/api/___",
        json=payload
    )
    return response.json()

# 서울 시청 좌표로 호출
result = get_heat_risk(___, ___)
print(result["risk_score"])`,
    solution: `import requests

def get_heat_risk(lat, lon, temperature=None):
    payload = {
        "lat": lat,
        "lon": lon,
    }
    if temperature:
        payload["temperature"] = temperature

    response = requests.post(
        "https://api.alphaearth.ai/api/risk",
        json=payload
    )
    return response.json()

# 서울 시청 좌표로 호출
result = get_heat_risk(37.5665, 126.9780)
print(result["risk_score"])`,
    hints: ['payload의 "lat", "lon" 키에 파라미터 변수를 그대로 대입하세요', '"temperature" 키 이름을 문자열로 넣으세요', '엔드포인트 경로는 "risk" 입니다', '서울 시청: 위도 37.5665, 경도 126.9780'],
  },
]

function QuizItem({ quiz, onAnswer }) {
  const [selected, setSelected] = useState(null)

  const pick = (i) => {
    if (selected !== null) return
    setSelected(i)
    onAnswer(i === quiz.answer)
  }

  return (
    <div className="quiz-card">
      <h3>Q{quiz.id}. {quiz.question}</h3>
      <div className="quiz-options">
        {quiz.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (selected !== null) {
            if (i === quiz.answer) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)} disabled={selected !== null}>
              {['①', '②', '③', '④'][i]} {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className={`quiz-feedback ${selected === quiz.answer ? 'correct' : 'wrong'}`}>
          {selected === quiz.answer ? '✅ 정답! ' : '❌ 오답. '} {quiz.explanation}
        </div>
      )}
    </div>
  )
}

function CodingTask({ task }) {
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [code, setCode] = useState(task.template)

  return (
    <div className="quiz-card">
      <h3>💻 {task.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{
          width: '100%',
          minHeight: 220,
          background: '#060d1a',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '1rem',
          color: 'var(--text)',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.6,
        }}
      />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }} onClick={() => setShowHints(!showHints)}>
          💡 힌트 {showHints ? '숨기기' : '보기'}
        </button>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }} onClick={() => setShowSolution(!showSolution)}>
          🔑 정답 {showSolution ? '숨기기' : '보기'}
        </button>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }} onClick={() => setCode(task.template)}>
          🔄 초기화
        </button>
      </div>
      {showHints && (
        <div className="info-box" style={{ marginTop: '0.75rem' }}>
          <strong>힌트:</strong>
          <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.88rem' }}>
            {task.hints.map((h, i) => <li key={i}>{h}</li>)}
          </ol>
        </div>
      )}
      {showSolution && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>정답 코드:</div>
          <pre className="code-block" style={{ margin: 0 }}>{task.solution}</pre>
        </div>
      )}
    </div>
  )
}

export default function Practice() {
  const [answers, setAnswers] = useState({})
  const score = Object.values(answers).filter(Boolean).length
  const total = quizzes.length

  return (
    <div className="practice-layout">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>✏️ 실습 & 퀴즈</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        AlphaEarth의 핵심 개념을 확인하고 코딩 실습으로 실력을 키우세요.
      </p>

      {/* Score board */}
      <div className="score-box">
        <div className="score-num">{score} / {total}</div>
        <div className="score-label">현재 점수 (객관식 {total}문항)</div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ background: 'var(--bg3)', height: 8, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(score / total) * 100}%`, background: 'var(--accent)', borderRadius: 999, transition: 'width 0.4s' }} />
          </div>
        </div>
        {score === total && total > 0 && (
          <div style={{ marginTop: '1rem', color: 'var(--green)', fontWeight: 600 }}>
            🎉 모두 정답! AlphaEarth 마스터입니다!
          </div>
        )}
      </div>

      {/* Quizzes */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>📝 객관식 문제</h2>
      {quizzes.map(q => (
        <QuizItem
          key={q.id}
          quiz={q}
          onAnswer={correct => setAnswers(a => ({ ...a, [q.id]: correct }))}
        />
      ))}

      {/* Coding tasks */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem' }}>💻 코딩 실습</h2>
      {CODING_TASKS.map(t => <CodingTask key={t.id} task={t} />)}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>실습을 마쳤나요?</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          인터랙티브 데모에서 실제 API와 동일한 시뮬레이션을 체험해보세요.
        </p>
        <a href="/demo" className="btn btn-primary">🔬 데모 체험하기</a>
      </div>
    </div>
  )
}
