import { useMemo, useState } from 'react'
import HeatMap from '../map/HeatMap'
import { fetchRisk, fetchRoute } from '../services/api'

function App() {
  const [location, setLocation] = useState({ lat: 37.5665, lon: 126.9780 })
  const [risk, setRisk] = useState(null)
  const [route, setRoute] = useState(null)
  const [end, setEnd] = useState({ lat: 37.57, lon: 127.02 })
  const [error, setError] = useState('')

  const riskColor = useMemo(() => {
    if (!risk) return '#3b82f6'
    if (risk.risk_score >= 75) return '#dc2626'
    if (risk.risk_score >= 50) return '#f97316'
    if (risk.risk_score >= 25) return '#facc15'
    return '#3b82f6'
  }, [risk])

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
        setError('')
      },
      () => setError('Could not access current location.')
    )
  }

  const loadRisk = async () => {
    try {
      const data = await fetchRisk(location)
      setRisk(data)
      setError('')
    } catch {
      setError('Failed to load risk. Check backend connectivity.')
    }
  }

  const loadRoute = async () => {
    try {
      const data = await fetchRoute({
        start_lat: location.lat,
        start_lon: location.lon,
        end_lat: end.lat,
        end_lon: end.lon,
      })
      setRoute(data)
      setError('')
    } catch {
      setError('Failed to load route risk prediction.')
    }
  }

  return (
    <main className="app-shell">
      <section className="controls">
        <h1>Heat Risk Guardian (KR MVP)</h1>
        <button onClick={detectLocation}>Use My Location</button>
        <button onClick={loadRisk}>Predict Heat Risk</button>
        <button onClick={loadRoute}>Predict Route Heat</button>

        <label>
          Destination Lat
          <input type="number" value={end.lat} onChange={(e) => setEnd((v) => ({ ...v, lat: Number(e.target.value) }))} />
        </label>
        <label>
          Destination Lon
          <input type="number" value={end.lon} onChange={(e) => setEnd((v) => ({ ...v, lon: Number(e.target.value) }))} />
        </label>

        {risk && (
          <div className="card" style={{ borderColor: riskColor }}>
            <p><strong>Risk Score:</strong> {risk.risk_score}</p>
            <p><strong>Level:</strong> {risk.risk_level}</p>
            <p><strong>Similarity:</strong> {risk.similarity}</p>
          </div>
        )}
        {route && (
          <div className="card">
            <p><strong>Route Avg Risk:</strong> {route.average_risk}</p>
            <p><strong>Recommendation:</strong> {route.recommended}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </section>

      <HeatMap location={location} risk={risk} route={route} />
    </main>
  )
}

export default App
