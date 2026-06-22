import { useState } from 'react'

const quizzes = [
  {
    id: 1,
    question: 'GEE에서 날짜 범위로 이미지를 필터링하는 메서드는?',
    options: ['.filterDate(start, end)', '.selectDate(start, end)', '.filterTime(start, end)', '.dateRange(start, end)'],
    answer: 0,
    explanation: '.filterDate(start, end)가 올바른 메서드입니다. 시작일과 종료일을 "YYYY-MM-DD" 형식 문자열로 전달합니다.',
  },
  {
    id: 2,
    question: 'Sentinel-2에서 NDVI 계산 시 사용하는 밴드 조합으로 올바른 것은? (normalizedDifference 기준)',
    options: ["['B8', 'B4'] — NIR, Red", "['B4', 'B8'] — Red, NIR", "['B3', 'B8'] — Green, NIR", "['B8', 'B3'] — NIR, Green"],
    answer: 0,
    explanation: "NDVI = (NIR - Red) / (NIR + Red) 이므로 normalizedDifference(['B8', 'B4'])가 맞습니다. 첫 번째 값에서 두 번째를 빼는 방식입니다.",
  },
  {
    id: 3,
    question: 'MODIS LST 원시값을 섭씨(°C)로 변환하는 공식은?',
    options: ['× 0.02 − 273.15', '× 0.1 − 273.15', '÷ 100 − 273.15', '× 0.02 − 260'],
    answer: 0,
    explanation: 'MODIS LST는 켈빈 × 50 스케일 정수로 저장됩니다. 실제값(K) = 원시값 × 0.02, 섭씨 = 실제값 − 273.15 입니다.',
  },
  {
    id: 4,
    question: '여러 이미지를 구름 제거 목적으로 합성할 때 가장 많이 쓰이는 방법은?',
    options: ['.median()', '.mean()', '.max()', '.first()'],
    answer: 0,
    explanation: '.median()은 픽셀별 중간값을 취해 구름(밝고 높은 값)과 그림자(어두운 값)를 효과적으로 제거합니다.',
  },
  {
    id: 5,
    question: 'GEE Code Editor에서 분석 결과를 Google Drive로 내보낼 때 사용하는 객체는?',
    options: ['Export.image.toDrive()', 'Map.export()', 'ee.Export.run()', 'Drive.save()'],
    answer: 0,
    explanation: 'Export.image.toDrive()를 사용합니다. 코드 실행 후 우측 Tasks 탭에서 Run을 눌러야 실제 내보내기가 시작됩니다.',
  },
  {
    id: 6,
    question: 'ee.ImageCollection에서 특정 지역의 이미지만 필터링하는 메서드는?',
    options: ['.filterBounds(geometry)', '.filterRegion(geometry)', '.clip(geometry)', '.intersects(geometry)'],
    answer: 0,
    explanation: '.filterBounds(geometry)는 지오메트리와 교차하는 이미지만 남깁니다. geometry는 Point, Rectangle, Polygon 등 모두 가능합니다.',
  },
  {
    id: 7,
    question: 'Sentinel-2에서 트루컬러(자연색) 이미지를 표시할 때 RGB 밴드 순서로 올바른 것은?',
    options: ["bands: ['B4', 'B3', 'B2']", "bands: ['B2', 'B3', 'B4']", "bands: ['B8', 'B4', 'B3']", "bands: ['B3', 'B4', 'B2']"],
    answer: 0,
    explanation: "트루컬러는 R=B4(적색), G=B3(녹색), B=B2(청색) 순서입니다. B2가 B(파란색)이므로 ['B4','B3','B2'] 순서가 자연색에 해당합니다.",
  },
  {
    id: 8,
    question: 'GEE Python API에서 인증을 완료한 후 초기화할 때 사용하는 코드는?',
    options: ['ee.Initialize(project="your-project")', 'ee.auth()', 'ee.connect(project="...")', 'ee.login()'],
    answer: 0,
    explanation: 'ee.Authenticate()로 인증 후 ee.Initialize(project="your-project-id")로 초기화합니다. project ID는 Google Cloud Console에서 확인하세요.',
  },
]

const CODING_TASKS = [
  {
    id: 'c1',
    title: '부산 지역 NDVI 계산',
    desc: '2024년 8월 부산 지역의 Sentinel-2 NDVI를 계산하는 코드를 완성하세요.',
    template: `// 부산 중심 좌표
var busan = ee.Geometry.Point([___, ___]);  // 부산: 129.0756, 35.1796
Map.centerObject(busan, 11);

var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-08-01', '2024-08-31')
  .filterBounds(___)                         // 부산 지역 필터
  .filter(ee.Filter.lt('___', 10))           // 구름 10% 미만
  .___();                                    // 중앙값 합성

// NDVI: NIR = B8, Red = B4
var ndvi = image.___(['B8', 'B4']).rename('NDVI');

Map.addLayer(ndvi, {min: -0.2, max: 0.8,
  palette: ['red', 'yellow', 'green']}, 'Busan NDVI');
print('부산 NDVI:', ndvi.sample(busan, 10).first().get('NDVI'));`,
    solution: `var busan = ee.Geometry.Point([129.0756, 35.1796]);
Map.centerObject(busan, 11);

var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-08-01', '2024-08-31')
  .filterBounds(busan)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median();

var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');

Map.addLayer(ndvi, {min: -0.2, max: 0.8,
  palette: ['red', 'yellow', 'green']}, 'Busan NDVI');
print('부산 NDVI:', ndvi.sample(busan, 10).first().get('NDVI'));`,
    hints: [
      '부산 좌표: 경도 129.0756, 위도 35.1796 → Point([경도, 위도]) 순서',
      '.filterBounds()에 좌표 변수명을 전달하세요',
      "구름 필터 키: 'CLOUDY_PIXEL_PERCENTAGE'",
      '중앙값 합성: .median()',
      'NDVI 계산: .normalizedDifference([NIR밴드, Red밴드])',
    ],
  },
  {
    id: 'c2',
    title: 'LST 단위 변환 함수 작성',
    desc: 'MODIS LST 컬렉션의 각 이미지를 켈빈에서 섭씨로 변환하는 .map() 함수를 완성하세요.',
    template: `var korea = ee.Geometry.Rectangle([124.5, 33.0, 130.0, 38.9]);

var lstCollection = ee.ImageCollection('MODIS/061/MOD11A1')
  .filterDate('2024-07-01', '2024-07-31')
  .filterBounds(korea)
  .select('LST_Day_1km');

// 각 이미지를 켈빈 → 섭씨로 변환하는 함수
var toCelsius = function(image) {
  return image
    .multiply(___)          // scale factor 0.02
    .subtract(___)          // 켈빈 → 섭씨 (273.15 빼기)
    .copyProperties(image, ['system:time_start']);
};

// 컬렉션 전체에 함수 적용
var lstCelsius = lstCollection.___(toCelsius).mean();

var palette = ['#313695', '#74add1', '#fee090', '#f46d43', '#a50026'];
Map.addLayer(lstCelsius, {min: 20, max: 45, palette: palette}, 'LST °C');
Map.centerObject(korea, 7);`,
    solution: `var korea = ee.Geometry.Rectangle([124.5, 33.0, 130.0, 38.9]);

var lstCollection = ee.ImageCollection('MODIS/061/MOD11A1')
  .filterDate('2024-07-01', '2024-07-31')
  .filterBounds(korea)
  .select('LST_Day_1km');

var toCelsius = function(image) {
  return image
    .multiply(0.02)
    .subtract(273.15)
    .copyProperties(image, ['system:time_start']);
};

var lstCelsius = lstCollection.map(toCelsius).mean();

var palette = ['#313695', '#74add1', '#fee090', '#f46d43', '#a50026'];
Map.addLayer(lstCelsius, {min: 20, max: 45, palette: palette}, 'LST °C');
Map.centerObject(korea, 7);`,
    hints: [
      'MODIS LST scale factor는 0.02 입니다',
      '켈빈 → 섭씨: 273.15를 빼세요',
      'ImageCollection의 모든 이미지에 함수를 적용: .map(함수명)',
    ],
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
              {['①', '②', '③', '④'][i]} <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{opt}</code>
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className={`quiz-feedback ${selected === quiz.answer ? 'correct' : 'wrong'}`}>
          {selected === quiz.answer ? '✅ 정답! ' : '❌ 오답. '}{quiz.explanation}
        </div>
      )}
    </div>
  )
}

function CodingTask({ task }) {
  const [code, setCode] = useState(task.template)
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  return (
    <div className="quiz-card">
      <h3>💻 {task.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{task.desc}</p>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ width: '100%', minHeight: 240, background: '#060d1a', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
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
        <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
          GEE에서 실행 ↗
        </a>
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

  return (
    <div className="practice-layout">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>✏️ GEE 실습 & 퀴즈</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Google Earth Engine의 핵심 개념을 퀴즈로 확인하고, 코딩 실습으로 실력을 키우세요.
      </p>

      <div className="score-box">
        <div className="score-num">{score} / {quizzes.length}</div>
        <div className="score-label">현재 점수</div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ background: 'var(--bg3)', height: 8, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(score / quizzes.length) * 100}%`, background: 'var(--accent)', borderRadius: 999, transition: 'width 0.4s' }} />
          </div>
        </div>
        {score === quizzes.length && <div style={{ marginTop: '1rem', color: 'var(--green)', fontWeight: 600 }}>🎉 GEE 마스터!</div>}
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>📝 객관식 문제</h2>
      {quizzes.map(q => (
        <QuizItem key={q.id} quiz={q} onAnswer={correct => setAnswers(a => ({ ...a, [q.id]: correct }))} />
      ))}

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem' }}>💻 코딩 실습</h2>
      {CODING_TASKS.map(t => <CodingTask key={t.id} task={t} />)}

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>더 많은 코드 예제가 필요하신가요?</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          코드 플레이그라운드에서 6가지 예제를 복사해 GEE Code Editor에 바로 실행해보세요.
        </p>
        <a href="/playground" className="btn btn-primary">💻 플레이그라운드 열기</a>
      </div>
    </div>
  )
}
