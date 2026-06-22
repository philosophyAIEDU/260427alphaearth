import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import { registerServiceWorker } from './services/pwa'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tutorial from './pages/Tutorial'
import Demo from './pages/Demo'
import Practice from './pages/Practice'
import HeatApp from './pages/App'

registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="site-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/app" element={<HeatApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
)
