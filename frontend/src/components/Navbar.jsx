import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">🌍</span>
        <span>Earth Engine 가이드</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>홈</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>AlphaEarth란?</NavLink>
        <NavLink to="/tutorial" className={({ isActive }) => isActive ? 'active' : ''}>튜토리얼</NavLink>
        <NavLink to="/playground" className={({ isActive }) => isActive ? 'active' : ''}>코드 예제</NavLink>
        <NavLink to="/ai-coder" className={({ isActive }) => isActive ? 'active' : ''}>🤖 AI 코드 생성</NavLink>
        <a
          href="https://code.earthengine.google.com/"
          target="_blank"
          rel="noopener"
          style={{ padding: '0.35rem 0.9rem', borderRadius: 6, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}
        >
          GEE ↗
        </a>
      </div>
    </nav>
  )
}
