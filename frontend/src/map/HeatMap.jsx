import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''
mapboxgl.accessToken = MAPBOX_TOKEN

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

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || mapRef.current) return

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [location.lon, location.lat],
      zoom: 11,
    })

    mapRef.current.on('load', () => {
      mapRef.current.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      mapRef.current.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        paint: { 'line-color': '#22c55e', 'line-width': 4 },
      })
    })

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
      }
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [location])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo({ center: [location.lon, location.lat], zoom: 12 })

    if (markerRef.current) {
      markerRef.current.remove()
    }
    markerRef.current = new mapboxgl.Marker({ color: risk?.risk_score >= 75 ? '#dc2626' : '#3b82f6' })
      .setLngLat([location.lon, location.lat])
      .addTo(mapRef.current)
  }, [location, risk])

  useEffect(() => {
    const source = mapRef.current?.getSource('route')
    const feature = toFeature(route)
    if (source && feature) {
      source.setData({ type: 'FeatureCollection', features: [feature] })
    }
  }, [route])

  if (!MAPBOX_TOKEN) {
    return (
      <section className="map map-fallback">
        <h2>Map preview unavailable</h2>
        <p>Set <code>VITE_MAPBOX_TOKEN</code> to enable the interactive map.</p>
        <p>Current location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>
      </section>
    )
  }

  return <section className="map" ref={mapContainer} />
}
