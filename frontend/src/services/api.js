const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export async function fetchRisk({ lat, lon }) {
  const res = await fetch(`${API_BASE}/risk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lon }),
  })
  if (!res.ok) throw new Error('Risk API failed')
  return res.json()
}

export async function fetchRoute(payload) {
  const res = await fetch(`${API_BASE}/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Route API failed')
  return res.json()
}
