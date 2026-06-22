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
Map: 서울 중심으로 zoom 10 (위성 모드)`,
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
    id: 'truecolor',
    category: '기초',
    title: '트루컬러 위성 사진',
    desc: 'Sentinel-2 RGB 밴드로 구름 없는 한국 자연색 이미지 표시',
    output: `Console:
  "촬영일: 2024-08-15"
  "구름 비율: 1.2 %"
Map: 서울 자연색 위성 이미지
  한강·남산·북한산 선명하게 확인 가능`,
    code: `var seoul = ee.Geometry.Point([126.978, 37.566]);
Map.centerObject(seoul, 11);

// 구름이 가장 적은 여름 이미지 1장 선택
var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-07-01', '2024-08-31')
  .filterBounds(seoul)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .sort('CLOUDY_PIXEL_PERCENTAGE')   // 구름 적은 순 정렬
  .first();

// 트루컬러: B4(빨강), B3(초록), B2(파랑)
Map.addLayer(image, {
  bands: ['B4', 'B3', 'B2'],
  min: 0, max: 3000, gamma: 1.4
}, '트루컬러');

print('촬영일:', ee.Date(image.get('system:time_start')).format('YYYY-MM-dd'));
print('구름 비율:', image.get('CLOUDY_PIXEL_PERCENTAGE'), '%');`,
  },
  {
    id: 'wildfire',
    category: '🔥 산불',
    title: '산불 피해 지역 탐지 (강원도)',
    desc: '2022년 울진·삼척 대형 산불 전후 비교 — NBR 연소비율 지수로 피해 면적 산출',
    output: `Console:
  "산불 피해 면적: 약 167.3 km²"
Map:
  🔴 빨강 = 심각한 연소 피해
  🟠 주황 = 중간 피해
  🟢 초록 = 피해 없음 (정상 산림)
  → 동해안을 따라 넓게 퍼진 피해 확인`,
    code: `// 2022년 3월 울진-삼척 대형 산불 지역
var fireArea = ee.Geometry.Rectangle([129.0, 36.8, 129.5, 37.2]);
Map.centerObject(fireArea, 10);

function getNBR(start, end) {
  var img = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(start, end)
    .filterBounds(fireArea)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();
  // NBR = (NIR - SWIR) / (NIR + SWIR), B8=NIR B12=SWIR
  return img.normalizedDifference(['B8', 'B12']).rename('NBR');
}

// 산불 전(2월) vs 산불 후(4월)
var preFire  = getNBR('2022-02-01', '2022-02-28');
var postFire = getNBR('2022-04-01', '2022-04-30');

// dNBR = 피해 강도 (값이 클수록 심각)
var dNBR = preFire.subtract(postFire).rename('dNBR');

Map.addLayer(dNBR, {
  min: 0, max: 0.7,
  palette: ['#1a9850', '#fee08b', '#f46d43', '#a50026']
}, '산불 피해 강도 (dNBR)');

// 피해 면적 계산 (dNBR > 0.27 = 중간 이상 피해)
var burned = dNBR.gt(0.27);
var area = burned.multiply(ee.Image.pixelArea())
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: fireArea, scale: 30, maxPixels: 1e9});
print('산불 피해 면적 (km²):', ee.Number(area.get('dNBR')).divide(1e6));`,
  },
  {
    id: 'drought',
    category: '🌵 가뭄',
    title: '가뭄 모니터링 (충남 지역)',
    desc: '식생 수분 지수(NDWI)로 가뭄 심각도 파악 — 평년과 비교',
    output: `Console:
  "2024 평균 NDWI: -0.08 (건조)"
  "평년 평균 NDWI: 0.05 (정상)"
Map:
  🟤 갈색 = 매우 건조 (가뭄 심각)
  🟡 노랑 = 약간 건조
  🔵 파랑 = 수분 충분
  → 가뭄 지역이 갈색으로 표시됨`,
    code: `// 충남 농경지 지역
var region = ee.Geometry.Rectangle([126.5, 36.2, 127.2, 36.9]);
Map.centerObject(region, 9);

function getNDWI(start, end) {
  var img = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(start, end)
    .filterBounds(region)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .median();
  // NDWI(식생수분) = (NIR - SWIR)/(NIR + SWIR)  B8=NIR, B11=SWIR
  return img.normalizedDifference(['B8', 'B11']).rename('NDWI');
}

var thisYear = getNDWI('2024-05-01', '2024-06-30');
Map.addLayer(thisYear, {
  min: -0.3, max: 0.3,
  palette: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e']
}, '2024 수분지수');

// 가뭄 지역(NDWI < 0)만 강조
var drought = thisYear.lt(0).selfMask();
Map.addLayer(drought, {palette: ['#a50026']}, '⚠️ 가뭄 위험지역');

var mean = thisYear.reduceRegion({
  reducer: ee.Reducer.mean(), geometry: region, scale: 30, maxPixels: 1e9});
print('2024 평균 NDWI (낮을수록 건조):', mean.get('NDWI'));`,
  },
  {
    id: 'flood',
    category: '🌊 홍수',
    title: '홍수 침수 지역 탐지 (레이더)',
    desc: 'Sentinel-1 레이더로 구름 속에서도 물에 잠긴 지역 탐지',
    output: `Console:
  "침수 면적: 약 42.8 km²"
Map:
  🔵 파랑 = 새로 침수된 지역
  → 홍수 전후 레이더 신호 변화로
     구름·비와 상관없이 물 탐지`,
    code: `// 한강 하류 / 김포-고양 일대 (홍수 취약지)
var region = ee.Geometry.Rectangle([126.5, 37.5, 126.9, 37.8]);
Map.centerObject(region, 11);

// Sentinel-1 레이더는 구름을 통과! (홍수 관측 최적)
function getRadar(start, end) {
  return ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterDate(start, end)
    .filterBounds(region)
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .select('VV')
    .median();
}

// 평소(건기) vs 홍수기(여름 장마)
var before = getRadar('2023-05-01', '2023-05-31');
var after  = getRadar('2023-07-01', '2023-07-31');

// 물은 레이더 신호가 낮음 → 차이가 크게 줄어든 곳 = 침수
var diff = before.subtract(after);
var flooded = diff.gt(3).selfMask();   // 3dB 이상 감소 = 침수

Map.addLayer(after, {min: -25, max: 0}, '레이더 영상', false);
Map.addLayer(flooded, {palette: ['#0066ff']}, '🌊 침수 지역');

var area = flooded.multiply(ee.Image.pixelArea())
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: region, scale: 30, maxPixels: 1e9});
print('침수 면적 (km²):', ee.Number(area.get('VV')).divide(1e6));`,
  },
  {
    id: 'heatisland',
    category: '🌡️ 폭염',
    title: '도시 열섬 효과 (서울 vs 숲)',
    desc: '도심과 산림의 지표면 온도 차이를 시각화 — 왜 도시가 더운가?',
    output: `Console:
  "서울 도심 평균: 38.4 °C"
  "북한산 숲 평균: 29.1 °C"
  "열섬 강도: 9.3 °C 차이!"
Map: 열화상 색으로 도심이 빨갛게 표시`,
    code: `var seoul = ee.Geometry.Point([126.978, 37.566]);
var downtown = ee.Geometry.Point([126.978, 37.566]);  // 시청
var forest   = ee.Geometry.Point([126.981, 37.659]);  // 북한산
Map.centerObject(seoul, 11);

// MODIS 여름 낮 지표면 온도
var lst = ee.ImageCollection('MODIS/061/MOD11A1')
  .filterDate('2024-07-01', '2024-08-31')
  .select('LST_Day_1km')
  .mean()
  .multiply(0.02).subtract(273.15);   // → 섭씨

Map.addLayer(lst, {
  min: 25, max: 40,
  palette: ['#313695', '#74add1', '#fee090', '#f46d43', '#a50026']
}, '지표면 온도 (°C)');

function tempAt(point, name) {
  var t = lst.reduceRegion({
    reducer: ee.Reducer.mean(), geometry: point.buffer(500), scale: 1000});
  print(name, '평균 온도 (°C):', t.get('LST_Day_1km'));
}
tempAt(downtown, '🏙️ 서울 도심');
tempAt(forest,   '🌲 북한산 숲');`,
  },
  {
    id: 'similar',
    category: '🧠 AlphaEarth',
    title: '서울과 닮은 지역 찾기 (임베딩)',
    desc: 'AlphaEarth 위성 임베딩으로 서울과 환경이 비슷한 지역을 유사도로 탐색',
    output: `Console:
  "서울 임베딩 추출 완료 (64차원)"
Map:
  🟢 초록 = 서울과 매우 유사한 환경
  → 비슷한 도시화·식생·기후 패턴을 가진
     동아시아 지역들이 밝게 표시됨`,
    code: `// Google의 위성 임베딩 데이터셋 (AlphaEarth 계열)
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
  .filterDate('2023-01-01', '2024-01-01')
  .mosaic();

var seoul = ee.Geometry.Point([126.978, 37.566]);
Map.centerObject(seoul, 6);

// 서울 지점의 임베딩 벡터 추출
var seoulVec = embeddings.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: seoul.buffer(1000),
  scale: 10
}).toArray();

// 전체 지역과 서울의 내적(유사도) 계산
var seoulImg = ee.Image.constant(seoulVec).arrayFlatten([
  embeddings.bandNames()
]);
var similarity = embeddings.multiply(seoulImg)
  .reduce(ee.Reducer.sum())
  .rename('similarity');

Map.addLayer(similarity, {
  min: 0, max: 1,
  palette: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf']
}, '서울과의 유사도');
print('서울 임베딩 추출 완료');`,
  },
  {
    id: 'embed-change',
    category: '🧠 AlphaEarth',
    title: '연도별 환경 변화 탐지 (임베딩)',
    desc: 'AlphaEarth 임베딩으로 2022년 vs 2024년을 비교해 크게 바뀐 지역 찾기',
    output: `Console:
  "변화 분석 완료"
Map:
  🔴 빨강 = 환경이 크게 바뀐 곳
     (개발·산불·홍수 등)
  ⚫ 검정 = 거의 그대로인 곳
  → 위성 사진 대신 64개 숫자만 비교해
     빠르게 변화를 탐지!`,
    code: `// AlphaEarth 임베딩: 두 해를 비교해 "변화량" 계산
var col = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');
var region = ee.Geometry.Rectangle([127.2, 36.45, 127.4, 36.6]); // 세종시
Map.centerObject(region, 11);

var y2022 = col.filterDate('2022-01-01', '2023-01-01').mosaic();
var y2024 = col.filterDate('2024-01-01', '2025-01-01').mosaic();

// 두 임베딩의 차이(거리)가 클수록 환경이 많이 바뀐 것
var diff = y2024.subtract(y2022);
var changeMagnitude = diff.pow(2)
  .reduce(ee.Reducer.sum())
  .sqrt()
  .rename('change');

Map.addLayer(changeMagnitude, {
  min: 0, max: 1.5,
  palette: ['#000004', '#51127c', '#b73779', '#fc8961', '#fcfdbf']
}, '환경 변화량 (2022→2024)');
print('💡 위성 이미지 대신 64개 숫자만 비교해 변화를 찾았어요');`,
  },
  {
    id: 'embed-classify',
    category: '🧠 AlphaEarth',
    title: '적은 예시로 토지 분류 (임베딩)',
    desc: 'AlphaEarth 임베딩을 입력으로 머신러닝 분류 — 숲·물·도시 자동 구분',
    output: `Console:
  "분류 완료: 숲 / 물 / 도시"
Map:
  🟩 초록 = 숲·식생
  🟦 파랑 = 물
  ⬜ 회색 = 도시·건물
  → 임베딩은 정보가 압축돼 있어
     적은 예시로도 분류가 잘 돼요`,
    code: `// 임베딩을 입력 특성으로 쓰면 분류가 쉬워져요
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
  .filterDate('2023-01-01', '2024-01-01')
  .mosaic();
Map.centerObject(ee.Geometry.Point([126.95, 37.55]), 11);

// 학습용 예시 점 (숲=0, 물=1, 도시=2)
var training = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([126.981, 37.659]), {landcover: 0}), // 북한산 숲
  ee.Feature(ee.Geometry.Point([126.960, 37.530]), {landcover: 1}), // 한강 물
  ee.Feature(ee.Geometry.Point([126.978, 37.566]), {landcover: 2})  // 시청 도시
]);

// 각 점에서 임베딩 값 샘플링
var samples = embeddings.sampleRegions({
  collection: training, properties: ['landcover'], scale: 10
});

// Random Forest 분류기 학습
var classifier = ee.Classifier.smileRandomForest(10)
  .train({features: samples, classProperty: 'landcover',
          inputProperties: embeddings.bandNames()});

// 전체 지역 분류
var classified = embeddings.classify(classifier);
Map.addLayer(classified, {
  min: 0, max: 2, palette: ['#1a9850', '#2c7fb8', '#999999']
}, '토지 분류 (숲/물/도시)');
print('분류 완료! 임베딩 덕분에 예시 3개로도 분류돼요');`,
  },
  {
    id: 'cropland',
    category: '🌾 농업',
    title: '농작물 생육 모니터링 (호남평야)',
    desc: '봄~가을 NDVI 시계열로 벼농사 생육 단계 추적',
    output: `Console:
  시계열 차트 출력 (Console 탭)
  - 5월: 모내기 (NDVI 낮음)
  - 7~8월: 생육 최성기 (NDVI 최대 ~0.85)
  - 10월: 수확 (NDVI 급감)`,
    code: `// 호남평야 (김제·정읍 일대 — 한국 최대 곡창지대)
var farmland = ee.Geometry.Point([126.88, 35.80]);
Map.centerObject(farmland, 12);

var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-03-01', '2024-11-30')
  .filterBounds(farmland)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .map(function(img) {
    var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return ndvi.copyProperties(img, ['system:time_start']);
  });

// 벼농사 1년 생육 그래프
var chart = ui.Chart.image.series({
  imageCollection: collection,
  region: farmland.buffer(300),
  reducer: ee.Reducer.mean(),
  scale: 10
}).setOptions({
  title: '호남평야 벼농사 생육 곡선 (2024)',
  vAxis: {title: 'NDVI (식생 활력)'},
  hAxis: {title: '월'},
  lineWidth: 3, pointSize: 4, colors: ['#1a9850']
});
print(chart);`,
  },
  {
    id: 'change',
    category: '🏗️ 변화탐지',
    title: '도시 개발 변화 탐지 (세종시)',
    desc: '10년 전과 현재를 비교해 신도시 개발로 사라진 녹지 확인',
    output: `Console:
  "녹지 → 도시 전환 면적: 약 28.5 km²"
Map:
  🔴 빨강 = 녹지가 도시/건물로 바뀐 곳
  → 세종시 신도시 개발 지역이
     선명하게 빨갛게 표시됨`,
    code: `// 세종특별자치시 (2012년부터 개발된 계획도시)
var sejong = ee.Geometry.Rectangle([127.2, 36.45, 127.35, 36.55]);
Map.centerObject(sejong, 12);

function getNDVI(year) {
  // 2015년 이전은 Landsat 8 사용
  return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate(year + '-05-01', year + '-09-30')
    .filterBounds(sejong)
    .filter(ee.Filter.lt('CLOUD_COVER', 20))
    .median()
    .normalizedDifference(['SR_B5', 'SR_B4'])  // NIR, Red
    .rename('NDVI');
}

var past    = getNDVI('2014');
var present = getNDVI('2024');

// 과거엔 녹지(NDVI>0.4)였지만 지금은 아닌 곳 = 개발됨
var lostGreen = past.gt(0.4).and(present.lt(0.2)).selfMask();

Map.addLayer(past, {min:0, max:0.8, palette:['white','green']}, '2014 식생', false);
Map.addLayer(present, {min:0, max:0.8, palette:['white','green']}, '2024 식생', false);
Map.addLayer(lostGreen, {palette: ['#e31a1c']}, '🏗️ 사라진 녹지');

var area = lostGreen.multiply(ee.Image.pixelArea())
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: sejong, scale: 30, maxPixels: 1e9});
print('녹지→도시 전환 면적 (km²):', ee.Number(area.get('NDVI')).divide(1e6));`,
  },
  {
    id: 'airquality',
    category: '🌫️ 대기질',
    title: '미세먼지·대기오염 (NO₂ 농도)',
    desc: 'Sentinel-5P 위성으로 한반도 이산화질소 분포 — 공장·교통 밀집지 확인',
    output: `Console:
  "수도권 평균 NO2가 가장 높게 측정됨"
Map:
  🔴 빨강 = 오염 심각 (수도권·산업단지)
  🔵 파랑 = 깨끗한 공기 (산악·농촌)
  → 서울·인천·울산 등이 빨갛게 표시`,
    code: `var korea = ee.Geometry.Rectangle([124.5, 33.0, 130.0, 38.9]);
Map.centerObject(korea, 7);

// Sentinel-5P 대류권 이산화질소(NO2)
var no2 = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
  .filterDate('2024-01-01', '2024-03-31')   // 겨울철 (대기오염 심함)
  .filterBounds(korea)
  .select('tropospheric_NO2_column_number_density')
  .mean();

Map.addLayer(no2, {
  min: 0, max: 0.0002,
  palette: ['#000080', '#0000ff', '#00ffff', '#ffff00', '#ff0000', '#800000']
}, '이산화질소(NO₂) 농도');

print('💡 빨간 지역일수록 자동차·공장 배출가스가 많은 곳입니다');
print('겨울철은 대기 정체로 오염 농도가 높게 나타납니다');`,
  },
  {
    id: 'snow',
    category: '❄️ 적설',
    title: '겨울철 적설 분포 (태백산맥)',
    desc: 'NDSI 적설 지수로 강원도 산악지대 눈 덮인 면적 측정',
    output: `Console:
  "적설 면적: 약 312.7 km²"
Map:
  ⚪ 흰색/하늘색 = 눈 덮인 지역
  → 태백산맥 고지대를 따라
     눈이 분포한 패턴 확인`,
    code: `// 강원도 태백산맥 일대
var region = ee.Geometry.Rectangle([128.4, 37.4, 129.2, 38.0]);
Map.centerObject(region, 9);

var winter = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-01-01', '2024-02-15')
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .median();

// NDSI(적설지수) = (Green - SWIR)/(Green + SWIR)  B3=Green, B11=SWIR
var ndsi = winter.normalizedDifference(['B3', 'B11']).rename('NDSI');

// NDSI > 0.4 = 눈으로 판정
var snow = ndsi.gt(0.4).selfMask();
Map.addLayer(winter, {bands:['B4','B3','B2'], min:0, max:3000}, '겨울 위성사진', false);
Map.addLayer(snow, {palette: ['#a6cee3']}, '❄️ 적설 지역');

var area = snow.multiply(ee.Image.pixelArea())
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: region, scale: 30, maxPixels: 1e9});
print('적설 면적 (km²):', ee.Number(area.get('NDSI')).divide(1e6));`,
  },
  {
    id: 'export',
    category: '📤 내보내기',
    title: '분석 결과 GeoTIFF 저장',
    desc: 'NDVI 결과를 Google Drive에 고해상도 파일로 내보내기',
    output: `Tasks 탭:
  ✓ "Seoul_NDVI" 작업 생성
  → Run 클릭 시 Drive에 저장 시작
파일: Seoul_NDVI.tif (10m 해상도)`,
    code: `var seoul = ee.Geometry.Rectangle([126.7, 37.4, 127.2, 37.8]);

var ndvi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-07-01', '2024-07-31')
  .filterBounds(seoul)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .normalizedDifference(['B8', 'B4']).rename('NDVI');

// Google Drive로 내보내기
Export.image.toDrive({
  image: ndvi,
  description: 'Seoul_NDVI',
  folder: 'GEE_Exports',
  region: seoul,
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e9
});
print('우측 Tasks 탭에서 Run을 눌러 내보내기를 시작하세요');`,
  },
]

const CATEGORIES = ['전체', '기초', '🧠 AlphaEarth', '🔥 산불', '🌵 가뭄', '🌊 홍수', '🌡️ 폭염', '🌾 농업', '🏗️ 변화탐지', '🌫️ 대기질', '❄️ 적설', '📤 내보내기']

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
          const hl = line
            .replace(/\/\/.*/g, m => `<span class="cmt">${m}</span>`)
            .replace(/(['"`])([^'"`\n]*)\1/g, m => `<span class="str">${m}</span>`)
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
  const [selected, setSelected] = useState(SNIPPETS[2])
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
        🧠 <strong>AlphaEarth 임베딩</strong> 예제부터 한국의 산불·가뭄·홍수·폭염 사례까지, 코드를 복사해 <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">GEE Code Editor</a>에 바로 붙여넣으세요.
      </p>

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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', alignItems: 'start' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="demo-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
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
              💡 이 출력은 예시입니다. 실제 결과는 GEE Code Editor에서 코드를 실행하세요.
            </p>
          </div>

          <div className="info-box">
            <strong>사용 방법:</strong> 위 코드를 <strong>복사</strong> → <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">GEE Code Editor</a> 열기 → 붙여넣기 → <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 4px', fontFamily: 'monospace' }}>Ctrl+Enter</kbd> 실행
          </div>
        </div>
      </div>
    </div>
  )
}
