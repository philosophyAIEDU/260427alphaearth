import { useState } from 'react'

const C = ({ children }) => <code style={{ background: '#1e293b', padding: '1px 5px', borderRadius: 4, fontSize: '0.88em', color: '#38bdf8' }}>{children}</code>

const steps = [
  {
    id: 0, icon: '🌍', title: 'Google Earth Engine이란?',
    content: () => (
      <div className="step-body">
        <p>
          <strong>Google Earth Engine(GEE)</strong>은 구글이 제공하는 클라우드 기반 지구 관측 플랫폼입니다.
          NASA, USGS, ESA 등에서 수집한 수십 년치 위성 이미지 데이터를 브라우저에서 단 몇 줄의
          JavaScript 또는 Python 코드로 분석할 수 있습니다.
        </p>
        <div className="info-box">
          💡 로컬 PC에 데이터를 다운받을 필요 없이, 페타바이트 규모의 위성 데이터를 구글의 클라우드에서
          직접 처리합니다.
        </div>
        <h3>🆚 GEE vs 기존 방식</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>항목</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>기존 방식</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>GEE</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['데이터 용량', 'GB~TB 직접 다운로드', '페타바이트 클라우드'],
                ['처리 속도', '로컬 CPU/GPU 의존', '구글 분산 컴퓨팅'],
                ['데이터 접근', 'NASA/USGS 개별 접속', '통합 카탈로그'],
                ['진입 장벽', '복잡한 환경 설정', '브라우저에서 즉시'],
                ['비용', '서버 구축 비용', '비상업 이용 무료'],
              ].map(([item, old, gee]) => (
                <tr key={item} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.55rem 0.8rem', color: 'var(--text)' }}>{item}</td>
                  <td style={{ padding: '0.55rem 0.8rem', color: 'var(--muted)' }}>{old}</td>
                  <td style={{ padding: '0.55rem 0.8rem', color: 'var(--green)' }}>{gee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>📋 GEE 계정 등록</h3>
        <ol style={{ paddingLeft: '1.25rem' }}>
          <li><a href="https://earthengine.google.com/signup/" target="_blank" rel="noopener">earthengine.google.com/signup</a>에서 신청</li>
          <li>Google 계정으로 로그인 후 용도(학술/상업) 선택</li>
          <li>승인 이메일 수신 후 <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">Code Editor</a> 접속</li>
        </ol>
        <div className="warn-box">⚠️ 승인에 1~3일 소요될 수 있습니다. 그 전에도 이 튜토리얼로 코드 구조를 익혀두세요.</div>
      </div>
    ),
  },
  {
    id: 1, icon: '💻', title: 'Code Editor 사용법',
    content: () => (
      <div className="step-body">
        <p>
          GEE Code Editor는 <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener">code.earthengine.google.com</a>에서
          접속하는 브라우저 기반 IDE입니다.
        </p>
        <h3>🖥️ 인터페이스 구성</h3>
        <div className="cards-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { area: '좌측 패널', desc: 'Scripts(내 코드), Docs(API 문서), Assets(업로드 파일)' },
            { area: '중앙 에디터', desc: 'JavaScript 코드 작성 영역. Run 버튼으로 실행' },
            { area: '우측 패널', desc: 'Inspector(픽셀 조회), Console(출력), Tasks(내보내기)' },
            { area: '하단 지도', desc: '분석 결과가 레이어로 표시되는 인터랙티브 지도' },
          ].map(p => (
            <div className="card" key={p.area} style={{ padding: '0.9rem' }}>
              <strong style={{ color: 'var(--accent)', fontSize: '0.88rem' }}>{p.area}</strong>
              <p style={{ marginTop: '0.35rem', fontSize: '0.83rem' }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <h3>⌨️ 자주 쓰는 단축키</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
          {[
            ['Ctrl + Enter', '코드 실행'],
            ['Ctrl + /', '주석 토글'],
            ['Ctrl + Space', '자동 완성'],
            ['Ctrl + Z', '실행 취소'],
          ].map(([key, desc]) => (
            <div key={key} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.2rem 0.5rem', fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--accent)' }}>{key}</kbd>
              <span style={{ color: 'var(--muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <h3>✅ 첫 번째 코드 실행</h3>
        <p>Code Editor에 아래 코드를 붙여넣고 <strong>Run</strong>을 누르세요:</p>
        <div className="code-block">
          <span className="cmt">// 콘솔에 메시지 출력</span>{'\n'}
          <span className="fn">print</span>(<span className="str">'Hello, Earth Engine!'</span>);{'\n\n'}
          <span className="cmt">// 서울 중심 좌표 지정</span>{'\n'}
          <span className="kw">var</span> <span className="var">seoul</span> = <span className="var">ee</span>.<span className="fn">Geometry</span>.<span className="fn">Point</span>([<span className="num">126.978</span>, <span className="num">37.566</span>]);{'\n'}
          <span className="var">Map</span>.<span className="fn">centerObject</span>(<span className="var">seoul</span>, <span className="num">10</span>);
        </div>
        <div className="info-box">💡 Console 탭에 'Hello, Earth Engine!'이 출력되고 지도가 서울로 이동하면 성공입니다.</div>
      </div>
    ),
  },
  {
    id: 2, icon: '🛰️', title: '위성 데이터 불러오기',
    content: () => (
      <div className="step-body">
        <p>GEE의 핵심 객체는 <C>ee.Image</C>와 <C>ee.ImageCollection</C>입니다.</p>
        <h3>📦 주요 데이터셋</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
          {[
            { id: 'COPERNICUS/S2_SR_HARMONIZED', name: 'Sentinel-2', res: '10m', note: '광학, 2017~현재' },
            { id: 'LANDSAT/LC09/C02/T1_L2', name: 'Landsat 9', res: '30m', note: '광학, 2021~현재' },
            { id: 'MODIS/006/MOD11A1', name: 'MODIS LST', res: '1km', note: '지표면 온도, 2000~현재' },
            { id: 'COPERNICUS/S5P/NRTI/L3_NO2', name: 'Sentinel-5P', res: '3.5km', note: '대기 오염(NO₂)' },
            { id: 'NASA/NASADEM_HGT/001', name: 'NASADEM', res: '30m', note: '디지털 고도 모델' },
          ].map(d => (
            <div key={d.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.7rem 0.9rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--text)', minWidth: 110 }}>{d.name}</strong>
              <code style={{ color: 'var(--accent)', fontSize: '0.8rem', flex: 1 }}>{d.id}</code>
              <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{d.res} · {d.note}</span>
            </div>
          ))}
        </div>
        <h3>📥 ImageCollection 불러오기 & 필터링</h3>
        <div className="code-block">
          <span className="cmt">// Sentinel-2 컬렉션 로드</span>{'\n'}
          <span className="kw">var</span> <span className="var">collection</span> = <span className="var">ee</span>.<span className="fn">ImageCollection</span>(<span className="str">'COPERNICUS/S2_SR_HARMONIZED'</span>){'\n'}
          {'  '}.<span className="fn">filterDate</span>(<span className="str">'2024-06-01'</span>, <span className="str">'2024-08-31'</span>)  <span className="cmt">// 날짜 필터</span>{'\n'}
          {'  '}.<span className="fn">filterBounds</span>(<span className="var">seoul</span>)             <span className="cmt">// 지역 필터</span>{'\n'}
          {'  '}.<span className="fn">filter</span>(<span className="var">ee</span>.<span className="fn">Filter</span>.<span className="fn">lt</span>(<span className="str">'CLOUDY_PIXEL_PERCENTAGE'</span>, <span className="num">10</span>));<span className="cmt"> // 구름 10% 미만</span>{'\n\n'}
          <span className="cmt">// 중앙값 합성 (구름 제거 효과)</span>{'\n'}
          <span className="kw">var</span> <span className="var">image</span> = <span className="var">collection</span>.<span className="fn">median</span>();{'\n\n'}
          <span className="fn">print</span>(<span className="str">'이미지 수:'</span>, <span className="var">collection</span>.<span className="fn">size</span>());
        </div>
        <div className="info-box">
          💡 <C>.median()</C>으로 여러 장의 이미지를 합성하면 구름이 자동으로 제거됩니다.
          픽셀별로 중간값을 취하기 때문입니다.
        </div>
      </div>
    ),
  },
  {
    id: 3, icon: '🌱', title: 'NDVI 계산 & 시각화',
    content: () => (
      <div className="step-body">
        <p>
          <strong>NDVI(정규화 식생 지수)</strong>는 가장 많이 쓰이는 식생 지표입니다.
          근적외선(NIR)과 적색(Red) 밴드의 반사율로 계산합니다.
        </p>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', textAlign: 'center', margin: '1rem 0', fontFamily: 'monospace' }}>
          <span style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>NDVI = (NIR − Red) / (NIR + Red)</span>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }}>범위: -1 ~ +1 · 식물이 많을수록 높은 값</div>
        </div>
        <h3>💻 NDVI 계산 코드 (Sentinel-2)</h3>
        <div className="code-block">
          <span className="kw">var</span> <span className="var">seoul</span> = <span className="var">ee</span>.<span className="fn">Geometry</span>.<span className="fn">Point</span>([<span className="num">126.978</span>, <span className="num">37.566</span>]);{'\n'}
          <span className="var">Map</span>.<span className="fn">centerObject</span>(<span className="var">seoul</span>, <span className="num">11</span>);{'\n\n'}
          <span className="kw">var</span> <span className="var">image</span> = <span className="var">ee</span>.<span className="fn">ImageCollection</span>(<span className="str">'COPERNICUS/S2_SR_HARMONIZED'</span>){'\n'}
          {'  '}.<span className="fn">filterDate</span>(<span className="str">'2024-07-01'</span>, <span className="str">'2024-07-31'</span>){'\n'}
          {'  '}.<span className="fn">filterBounds</span>(<span className="var">seoul</span>){'\n'}
          {'  '}.<span className="fn">filter</span>(<span className="var">ee</span>.<span className="fn">Filter</span>.<span className="fn">lt</span>(<span className="str">'CLOUDY_PIXEL_PERCENTAGE'</span>, <span className="num">10</span>)){'\n'}
          {'  '}.<span className="fn">median</span>();{'\n\n'}
          <span className="cmt">// NDVI 계산: B8=NIR, B4=Red</span>{'\n'}
          <span className="kw">var</span> <span className="var">ndvi</span> = <span className="var">image</span>.<span className="fn">normalizedDifference</span>([<span className="str">'B8'</span>, <span className="str">'B4'</span>]).<span className="fn">rename</span>(<span className="str">'NDVI'</span>);{'\n\n'}
          <span className="cmt">// 색상 팔레트로 시각화</span>{'\n'}
          <span className="kw">var</span> <span className="var">palette</span> = [<span className="str">'#d73027'</span>, <span className="str">'#fee08b'</span>, <span className="str">'#1a9850'</span>];{'\n'}
          <span className="var">Map</span>.<span className="fn">addLayer</span>(<span className="var">ndvi</span>, &#123;<span className="var">min</span>: -<span className="num">0.2</span>, <span className="var">max</span>: <span className="num">0.8</span>, <span className="var">palette</span>: <span className="var">palette</span>&#125;, <span className="str">'NDVI'</span>);{'\n\n'}
          <span className="cmt">// 특정 지점의 NDVI 값 출력</span>{'\n'}
          <span className="kw">var</span> <span className="var">val</span> = <span className="var">ndvi</span>.<span className="fn">sample</span>(<span className="var">seoul</span>, <span className="num">10</span>).<span className="fn">first</span>();{'\n'}
          <span className="fn">print</span>(<span className="str">'서울 시청 NDVI:'</span>, <span className="var">val</span>.<span className="fn">get</span>(<span className="str">'NDVI'</span>));
        </div>
        <h3>🎨 NDVI 값 해석</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { range: '< 0', label: '물/암석', color: '#60a5fa' },
            { range: '0 ~ 0.2', label: '나지/도시', color: '#f87171' },
            { range: '0.2 ~ 0.5', label: '초지/관목', color: '#fbbf24' },
            { range: '> 0.5', label: '밀림/건강 식생', color: '#34d399' },
          ].map(v => (
            <div key={v.range} style={{ background: 'var(--bg3)', border: `1px solid ${v.color}`, borderRadius: 6, padding: '0.5rem 0.8rem', fontSize: '0.83rem' }}>
              <div style={{ color: v.color, fontWeight: 600 }}>{v.range}</div>
              <div style={{ color: 'var(--muted)' }}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4, icon: '🌡️', title: '지표면 온도(LST) 분석',
    content: () => (
      <div className="step-body">
        <p>
          MODIS 위성의 열 적외선 센서로 측정한 <strong>지표면 온도(LST)</strong>를 활용하면
          도시 열섬 효과와 기후 변화를 정량적으로 분석할 수 있습니다.
        </p>
        <h3>💻 LST 분석 코드 (MODIS)</h3>
        <div className="code-block">
          <span className="kw">var</span> <span className="var">korea</span> = <span className="var">ee</span>.<span className="fn">Geometry</span>.<span className="fn">Rectangle</span>([<span className="num">124.5</span>, <span className="num">33.0</span>, <span className="num">130.0</span>, <span className="num">38.9</span>]);{'\n\n'}
          <span className="cmt">// MODIS 일별 LST 데이터 로드</span>{'\n'}
          <span className="kw">var</span> <span className="var">lst</span> = <span className="var">ee</span>.<span className="fn">ImageCollection</span>(<span className="str">'MODIS/061/MOD11A1'</span>){'\n'}
          {'  '}.<span className="fn">filterDate</span>(<span className="str">'2024-07-01'</span>, <span className="str">'2024-07-31'</span>){'\n'}
          {'  '}.<span className="fn">filterBounds</span>(<span className="var">korea</span>){'\n'}
          {'  '}.<span className="fn">select</span>(<span className="str">'LST_Day_1km'</span>)         <span className="cmt">// 낮 시간 LST</span>{'\n'}
          {'  '}.<span className="fn">mean</span>();{'\n\n'}
          <span className="cmt">// 켈빈 → 섭씨 변환 (× 0.02 − 273.15)</span>{'\n'}
          <span className="kw">var</span> <span className="var">lstCelsius</span> = <span className="var">lst</span>.<span className="fn">multiply</span>(<span className="num">0.02</span>).<span className="fn">subtract</span>(<span className="num">273.15</span>);{'\n\n'}
          <span className="kw">var</span> <span className="var">palette</span> = [<span className="str">'#313695'</span>, <span className="str">'#74add1'</span>, <span className="str">'#fee090'</span>, <span className="str">'#f46d43'</span>, <span className="str">'#a50026'</span>];{'\n'}
          <span className="var">Map</span>.<span className="fn">addLayer</span>(<span className="var">lstCelsius</span>, &#123;<span className="var">min</span>: <span className="num">20</span>, <span className="var">max</span>: <span className="num">45</span>, <span className="var">palette</span>&#125;, <span className="str">'LST (°C)'</span>);{'\n'}
          <span className="var">Map</span>.<span className="fn">centerObject</span>(<span className="var">korea</span>, <span className="num">7</span>);
        </div>
        <div className="warn-box">
          ⚠️ MODIS LST의 원시값은 켈빈 × 50 스케일 정수입니다.
          섭씨로 변환하려면 반드시 <C>× 0.02 − 273.15</C>를 적용하세요.
        </div>
        <h3>📊 시계열 분석 추가</h3>
        <div className="code-block">
          <span className="cmt">// 서울 지점의 연간 평균 LST 시계열</span>{'\n'}
          <span className="kw">var</span> <span className="var">chart</span> = <span className="var">ui</span>.<span className="fn">Chart</span>.<span className="fn">image</span>.<span className="fn">series</span>(&#123;{'\n'}
          {'  '}<span className="var">imageCollection</span>: <span className="var">ee</span>.<span className="fn">ImageCollection</span>(<span className="str">'MODIS/061/MOD11A1'</span>){'\n'}
          {'    '}.<span className="fn">filterDate</span>(<span className="str">'2020-01-01'</span>, <span className="str">'2024-12-31'</span>){'\n'}
          {'    '}.<span className="fn">select</span>(<span className="str">'LST_Day_1km'</span>){'\n'}
          {'    '}.<span className="fn">map</span>(<span className="kw">function</span>(<span className="var">img</span>) &#123;{'\n'}
          {'      '}<span className="kw">return</span> <span className="var">img</span>.<span className="fn">multiply</span>(<span className="num">0.02</span>).<span className="fn">subtract</span>(<span className="num">273.15</span>);{'\n'}
          {'    '}&#125;),{'\n'}
          {'  '}<span className="var">region</span>: <span className="var">seoul</span>,{'\n'}
          {'  '}<span className="var">scale</span>: <span className="num">1000</span>{'\n'}
          &#125;).<span className="fn">setOptions</span>(&#123;<span className="var">title</span>: <span className="str">'서울 지표면 온도 (2020-2024)'</span>&#125;);{'\n'}
          <span className="fn">print</span>(<span className="var">chart</span>);
        </div>
      </div>
    ),
  },
  {
    id: 5, icon: '📤', title: '결과 내보내기',
    content: () => (
      <div className="step-body">
        <p>
          분석 결과는 Google Drive, Cloud Storage, GEE Asset으로 내보낼 수 있습니다.
          대용량 데이터는 비동기 <strong>Tasks</strong>로 처리됩니다.
        </p>
        <h3>☁️ Google Drive로 내보내기</h3>
        <div className="code-block">
          <span className="cmt">// NDVI 이미지를 GeoTIFF로 Drive에 저장</span>{'\n'}
          <span className="var">Export</span>.<span className="fn">image</span>.<span className="fn">toDrive</span>(&#123;{'\n'}
          {'  '}<span className="var">image</span>: <span className="var">ndvi</span>,                    <span className="cmt">// 내보낼 이미지</span>{'\n'}
          {'  '}<span className="var">description</span>: <span className="str">'Seoul_NDVI_2024'</span>, <span className="cmt">// 파일명</span>{'\n'}
          {'  '}<span className="var">folder</span>: <span className="str">'GEE_Exports'</span>,       <span className="cmt">// Drive 폴더</span>{'\n'}
          {'  '}<span className="var">region</span>: <span className="var">seoul</span>.<span className="fn">buffer</span>(<span className="num">10000</span>), <span className="cmt">// 10km 버퍼</span>{'\n'}
          {'  '}<span className="var">scale</span>: <span className="num">10</span>,                   <span className="cmt">// 해상도 10m</span>{'\n'}
          {'  '}<span className="var">crs</span>: <span className="str">'EPSG:4326'</span>           <span className="cmt">// 좌표계 WGS84</span>{'\n'}
          &#125;);
        </div>
        <div className="info-box">
          💡 코드 실행 후 우측 패널 <strong>Tasks</strong> 탭에서 <strong>Run</strong>을 눌러야 실제 내보내기가 시작됩니다.
        </div>
        <h3>🐍 Python API (geemap)</h3>
        <p>Python 환경(Jupyter, Colab)에서도 동일한 분석이 가능합니다:</p>
        <div className="code-block">
          <span className="cmt"># Google Colab에서 실행</span>{'\n'}
          <span className="kw">import</span> <span className="var">ee</span>{'\n'}
          <span className="kw">import</span> <span className="var">geemap</span>{'\n\n'}
          <span className="var">ee</span>.<span className="fn">Authenticate</span>()    <span className="cmt"># 최초 1회 인증</span>{'\n'}
          <span className="var">ee</span>.<span className="fn">Initialize</span>(<span className="var">project</span>=<span className="str">'your-project-id'</span>){'\n\n'}
          <span className="var">image</span> = (<span className="var">ee</span>.<span className="fn">ImageCollection</span>(<span className="str">'COPERNICUS/S2_SR_HARMONIZED'</span>){'\n'}
          {'        '}.<span className="fn">filterDate</span>(<span className="str">'2024-07-01'</span>, <span className="str">'2024-07-31'</span>){'\n'}
          {'        '}.<span className="fn">median</span>()){'\n\n'}
          <span className="var">ndvi</span> = <span className="var">image</span>.<span className="fn">normalizedDifference</span>([<span className="str">'B8'</span>, <span className="str">'B4'</span>]){'\n\n'}
          <span className="var">Map</span> = <span className="var">geemap</span>.<span className="fn">Map</span>(){'\n'}
          <span className="var">Map</span>.<span className="fn">addLayer</span>(<span className="var">ndvi</span>, &#123;<span className="str">'min'</span>: -<span className="num">0.2</span>, <span className="str">'max'</span>: <span className="num">0.8</span>, <span className="str">'palette'</span>: [<span className="str">'red'</span>, <span className="str">'yellow'</span>, <span className="str">'green'</span>]&#125;, <span className="str">'NDVI'</span>){'\n'}
          <span className="var">Map</span>
        </div>
        <h3>🔗 유용한 링크</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { url: 'https://developers.google.com/earth-engine/datasets', label: '📦 GEE 데이터 카탈로그' },
            { url: 'https://developers.google.com/earth-engine/apidocs', label: '📖 JavaScript API 문서' },
            { url: 'https://geemap.org', label: '🐍 geemap (Python 라이브러리)' },
            { url: 'https://developers.google.com/earth-engine/tutorials', label: '🎓 공식 튜토리얼' },
          ].map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.6rem 0.9rem', fontSize: '0.88rem', display: 'block' }}>
              {l.label} ↗
            </a>
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
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>목차</div>
        <nav className="tut-nav">
          {steps.map(s => (
            <button key={s.id} className={active === s.id ? 'active' : ''} onClick={() => setActive(s.id)}>
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
            <button className="btn btn-outline" onClick={() => setActive(a => a - 1)} disabled={active === 0} style={{ opacity: active === 0 ? 0.3 : 1 }}>← 이전</button>
            {active < steps.length - 1
              ? <button className="btn btn-primary" onClick={() => setActive(a => a + 1)}>다음 →</button>
              : <a href="/playground" className="btn btn-primary">코드 플레이그라운드 →</a>}
          </div>
        </div>
      </main>
    </div>
  )
}
