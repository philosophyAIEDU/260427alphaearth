import { useState } from 'react'

const SNIPPETS = [
  {
    id: 'hello',
    category: '기초',
    title: 'Hello Earth Engine',
    desc: '첫 번째 GEE 코드 — 콘솔 출력과 지도 이동',
    output: `Console:
  "Hello, Earth Engine!"
  "서울 좌표: [126.978, 37.566]"
Map: 서울 중심으로 zoom 10`,
    code: `// 콘솔에 메시지 출력
print('Hello, Earth Engine!');

// 서울 중심 좌표
var seoul = ee.Geometry.Point([126.978, 37.566]);
print('서울 좌표:', seoul.coordinates());

// 지도 이동
Map.centerObject(seoul, 10);
Map.setOptions('SATELLITE');`,
  },
  {
    id: 'ndvi',
    category: '식생',
    title: 'NDVI 계산 (Sentinel-2)',
    desc: '서울 지역 여름철 식생 지수 계산 및 색상 시각화',
    output: `Console:
  "이미지 수: 7"
  "서울 시청 NDVI: 0.142"
Map: NDVI 레이어 추가됨
  빨간색 = 비식생/도시
  노란색 = 초지
  녹색 = 산림/공원`,
    code: `var seoul = ee.Geometry.Point([126.978, 37.566]);
Map.centerObject(seoul, 11);

// Sentinel-2 여름철 이미지 (구름 10% 미만)
var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-06-01', '2024-08-31')
  .filterBounds(seoul)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

print('이미지 수:', collection.size());

var image = collection.median();

// NDVI 계산: B8=NIR, B4=Red
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');

// 시각화
var palette = ['#d73027', '#fee08b', '#91cf60', '#1a9850'];
Map.addLayer(ndvi, {min: -0.2, max: 0.8, palette: palette}, 'NDVI');

// 특정 지점 값 출력
var sample = ndvi.sample(seoul, 10).first();
print('서울 시청 NDVI:', sample.get('NDVI'));`,
  },
  {
    id: 'lst',
    category: '기온',
    title: '지표면 온도 LST (MODIS)',
    desc: '한반도 여름철 평균 지표면 온도 — 도시 열섬 확인',
    output: `Console:
  "한반도 평균 LST: 35.2 °C"
  "최고 LST 지점: 38.7 °C"
Map: 열화상 스타일 LST 레이어
  파란색 = 낮은 온도 (<20°C)
  노란색 = 중간 (30°C)
  빨간색 = 높은 온도 (>40°C)`,
    code: `var korea = ee.Geometry.Rectangle([124.5, 33.0, 130.0, 38.9]);
Map.centerObject(korea, 7);

// MODIS 일별 LST
var lstCollection = ee.ImageCollection('MODIS/061/MOD11A1')
  .filterDate('2024-07-01', '2024-07-31')
  .filterBounds(korea)
  .select('LST_Day_1km');

// 켈빈 → 섭씨 변환 (× 0.02 − 273.15)
var lstCelsius = lstCollection.mean()
  .multiply(0.02)
  .subtract(273.15);

// 시각화
var palette = ['#313695', '#74add1', '#fee090', '#f46d43', '#a50026'];
Map.addLayer(lstCelsius, {min: 20, max: 45, palette: palette}, 'LST (°C)');

// 한반도 평균 온도
var mean = lstCelsius.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: korea,
  scale: 1000
});
print('한반도 평균 LST:', mean.get('LST_Day_1km'), '°C');`,
  },
  {
    id: 'timeseries',
    category: '시계열',
    title: 'NDVI 시계열 차트',
    desc: '서울 남산 지점의 연간 식생 변화 시계열',
    output: `Console:
  시계열 차트 출력됨
  (Console 탭에서 확인)

  차트 내용:
  - X축: 2020-01 ~ 2024-12
  - Y축: NDVI 값 (0 ~ 0.8)
  - 봄~여름 최대 / 겨울 최소 패턴`,
    code: `// 서울 남산 좌표
var namsan = ee.Geometry.Point([126.9882, 37.5512]);
Map.centerObject(namsan, 12);

// 월별 Sentinel-2 NDVI 시계열
var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2020-01-01', '2024-12-31')
  .filterBounds(namsan)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(function(img) {
    var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return ndvi.copyProperties(img, ['system:time_start']);
  });

// 시계열 차트 생성
var chart = ui.Chart.image.series({
  imageCollection: collection,
  region: namsan,
  reducer: ee.Reducer.mean(),
  scale: 10
}).setOptions({
  title: '서울 남산 NDVI 시계열 (2020-2024)',
  vAxis: {title: 'NDVI', minValue: 0, maxValue: 1},
  hAxis: {title: '날짜'},
  lineWidth: 2,
  pointSize: 3
});

print(chart);`,
  },
  {
    id: 'truecolor',
    category: '시각화',
    title: '트루컬러 합성 이미지',
    desc: 'Sentinel-2 RGB 밴드 조합으로 자연색 위성 이미지 표시',
    output: `Map: Sentinel-2 트루컬러 레이어
  R = B4 (적색 밴드)
  G = B3 (녹색 밴드)
  B = B2 (청색 밴드)

  여름철 구름 없는 서울 전경
  한강, 남산, 북한산 확인 가능`,
    code: `var seoul = ee.Geometry.Point([126.978, 37.566]);
Map.centerObject(seoul, 11);

// 구름 적은 여름 이미지 선택
var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-07-01', '2024-08-31')
  .filterBounds(seoul)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .sort('CLOUDY_PIXEL_PERCENTAGE')  // 구름 가장 적은 순
  .first();

// 트루컬러: B4(Red), B3(Green), B2(Blue)
Map.addLayer(image, {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.4
}, '트루컬러');

// 위성 촬영일 출력
print('촬영일:', ee.Date(image.get('system:time_start')).format('YYYY-MM-dd'));
print('구름 비율:', image.get('CLOUDY_PIXEL_PERCENTAGE'), '%');`,
  },
  {
    id: 'export',
    category: '내보내기',
    title: 'GeoTIFF로 내보내기',
    desc: 'NDVI 분석 결과를 Google Drive에 GeoTIFF 파일로 저장',
    output: `Tasks 탭:
  ✓ "Seoul_NDVI_July2024" 작업 생성
  → Run 버튼 클릭 후 내보내기 시작

Console:
  "내보내기 완료 후 Drive > GEE_Exports 폴더 확인"

파일 형식:
  Seoul_NDVI_July2024.tif
  해상도: 10m, 좌표계: WGS84`,
    code: `var seoul = ee.Geometry.Rectangle([126.7, 37.4, 127.2, 37.8]);

var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-07-01', '2024-07-31')
  .filterBounds(seoul)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median();

var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');

// Google Drive로 내보내기
Export.image.toDrive({
  image: ndvi,
  description: 'Seoul_NDVI_July2024',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Seoul_NDVI_July2024',
  region: seoul,
  scale: 10,             // 10m 해상도
  crs: 'EPSG:4326',     // WGS84
  maxPixels: 1e9
});

print('내보내기 완료 후 Drive > GEE_Exports 폴더 확인');`,
  },
]

const CATEGORIES = ['전체', '기초', '식생', '기온', '시계열', '시각화', '내보내기']

function CodeBlock({ code, onCopy, copied }) {
  const lines = code.split('\n')
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onCopy}
        style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          background: copied ? 'rgba(52,211,153,0.15)' : 'var(--bg3)',
          border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
          color: copied ? 'var(--green)' : 'var(--muted)',
          borderRadius: 6, padding: '0.3rem 0.7rem', fontSize: '0.78rem',
          cursor: 'pointer', zIndex: 1, transition: 'all 0.2s',
        }}
      >
        {copied ? '✓ 복사됨' : '복사'}
      </button>
      <pre className="code-block" style={{ margin: 0, paddingTop: '2.5rem', overflowX: 'auto' }}>
        {lines.map((line, i) => {
          // simple syntax highlight
          const hl = line
            .replace(/\/\/.*/g, m => `<span class="cmt">${m}</span>`)
            .replace(/(['"`])([^'"`\n]*)\1/g, (m, q, s) => `<span class="str">${m}</span>`)
            .replace(/\b(var|function|return|if|else)\b/g, m => `<span class="kw">${m}</span>`)
            .replace(/\b(\d+\.?\d*)\b/g, m => `<span class="num">${m}</span>`)
            .replace(/\.([a-zA-Z_]\w*)\(/g, (m, fn) => `.<span class="fn">${fn}</span>(`)
          return (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{ color: '#2d3f58', userSelect: 'none', minWidth: 28, textAlign: 'right', marginRight: '1rem', fontSize: '0.78rem' }}>{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: hl }} />
            </div>
          )
        })}
      </pre>
    </div>
  )
}

export default function Playground() {
  const [selected, setSelected] = useState(SNIPPETS[0])
  const [category, setCategory] = useState('전체')
  const [copied, setCopied] = useState(false)

  const filtered = category === '전체' ? SNIPPETS : SNIPPETS.filter(s => s.category === category)

  const copy = () => {
    navigator.clipboard.writeText(selected.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="section-title">💻 코드 플레이그라운드</div>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        예제 코드를 복사해 <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">GEE Code Editor</a>에 바로 붙여넣으세요.
      </p>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn ${category === c ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem' }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Snippet list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              style={{
                background: selected.id === s.id ? 'var(--bg3)' : 'var(--bg2)',
                border: `1px solid ${selected.id === s.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8, padding: '0.85rem 1rem', textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56,189,248,0.1)', color: 'var(--accent)', padding: '0.1rem 0.5rem', borderRadius: 999 }}>
                  {s.category}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selected.id === s.id ? 'var(--accent)' : 'var(--text)' }}>{s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.4 }}>{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Code + output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Code */}
          <div className="demo-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{selected.title}</h3>
              <a
                href="https://code.earthengine.google.com/"
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem' }}
              >
                GEE Editor에서 열기 ↗
              </a>
            </div>
            <CodeBlock code={selected.code} onCopy={copy} copied={copied} />
          </div>

          {/* Simulated output */}
          <div className="demo-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              예상 출력 결과
            </div>
            <pre style={{
              background: '#060d1a', border: '1px solid var(--border)', borderRadius: 8,
              padding: '1rem', fontFamily: 'monospace', fontSize: '0.83rem',
              color: '#86efac', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap'
            }}>
              {selected.output}
            </pre>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.75rem', marginBottom: 0 }}>
              💡 이 출력은 시뮬레이션입니다. 실제 결과는 GEE Code Editor에서 코드를 실행하세요.
            </p>
          </div>

          {/* Quick tip */}
          <div className="info-box">
            <strong>사용 방법:</strong> 위 코드를 <strong>복사</strong> → <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">GEE Code Editor</a> 열기 → 붙여넣기 → <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 4px', fontFamily: 'monospace' }}>Run</kbd> 클릭
          </div>
        </div>
      </div>
    </div>
  )
}
