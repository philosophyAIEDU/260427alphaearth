import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">🌍</span>
        <span>AlphaEarth</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>홈</NavLink>
        <NavLink to="/tutorial" className={({ isActive }) => isActive ? 'active' : ''}>튜토리얼</NavLink>
        <NavLink to="/demo" className={({ isActive }) => isActive ? 'active' : ''}>인터랙티브 데모</NavLink>
        <NavLink to="/practice" className={({ isActive }) => isActive ? 'active' : ''}>실습</NavLink>
        <NavLink to="/app" className={({ isActive }) => isActive ? 'active' : ''}>앱 실행</NavLink>
      </div>
    </nav>
  )
}
