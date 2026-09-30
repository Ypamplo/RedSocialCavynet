import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { navigation } from "../routes/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  return <header className="topbar">
    <Link className="brand" to="/inicio"><span className="brand-mark">+</span> cavynet</Link>
    <button className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>Menú</button>
    <nav id="main-navigation" aria-label="Navegación principal" className={open ? "topnav is-open" : "topnav"}>{navigation.map(({ to, label }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
    <Link className="profile-link" to="/perfil" aria-label="Ver mi perfil"><img src={user.avatar} alt="" /><span>{user.name}</span></Link>
    <button className="logout-button" onClick={logout}>Cerrar sesión</button>
  </header>
}
