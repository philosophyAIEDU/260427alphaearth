import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import { registerServiceWorker } from './services/pwa'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tutorial from './pages/Tutorial'
import Playground from './pages/Playground'
import Practice from './pages/Practice'
import AICoder from './pages/AICoder'
import AboutAlphaEarth from './pages/AboutAlphaEarth'

registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="site-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutAlphaEarth />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/ai-coder" element={<AICoder />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
)
