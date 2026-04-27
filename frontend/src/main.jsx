import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styles.css'
import { registerServiceWorker } from './services/pwa'

registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
