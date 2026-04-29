import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''
mapboxgl.accessToken = TOKEN

function toFeature(route) {
  if (!route?.points?.length) return null
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route.points.map((p) => [p.lon, p.lat]),
    },
  }
}

export default function HeatMap({ location, risk, route }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const loadedRef = useRef(false)
  const [noToken, setNoToken] = useState(!TOKEN)

  useEffect(() => {
    if (!TOKEN) return
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [location.lon, location.lat],
      zoom: 11,
    })

    map.on('load', () => {
      loadedRef.current = true
      map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        paint: { 'line-color': '#22c55e', 'line-width': 4 },
      })
    })

    map.on('error', (e) => {
      if (e.error?.message?.toLowerCase().includes('token')) {
        setNoToken(true)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      loadedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !loadedRef.current) return

    if (markerRef.current) {
      markerRef.current.remove()
    }
    markerRef.current = new mapboxgl.Marker({
      color: risk?.risk_score >= 75 ? '#dc2626' : '#3b82f6',
    })
      .setLngLat([location.lon, location.lat])
      .addTo(mapRef.current)

    mapRef.current.flyTo({ center: [location.lon, location.lat], zoom: 12 })
  }, [location, risk])

  useEffect(() => {
    if (!mapRef.current || !loadedRef.current) return
    const source = mapRef.current.getSource('route')
    const feature = toFeature(route)
    if (source && feature) {
      source.setData({ type: 'FeatureCollection', features: [feature] })
    }
  }, [route])

  if (noToken) {
    return (
      <section className="map map--no-token">
        <p>
          지도를 표시하려면 Netlify 환경 변수에<br />
          <code>VITE_MAPBOX_TOKEN</code>을 설정해주세요.
        </p>
      </section>
    )
  }

  return <section className="map" ref={mapContainer} />
}
