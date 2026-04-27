import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

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

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
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
  }, [location])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo({ center: [location.lon, location.lat], zoom: 12 })

    new mapboxgl.Marker({ color: risk?.risk_score >= 75 ? '#dc2626' : '#3b82f6' })
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

  return <section className="map" ref={mapContainer} />
}
