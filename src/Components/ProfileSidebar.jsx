import { Link, NavLink } from "react-router-dom"
import { useSocial } from "./social-context"
import { navigation } from "../routes/navigation"

export default function ProfileSidebar() {
  const { currentUser } = useSocial()
  return <aside className="left-column"><section className="profile-card"><div className="profile-cover" /><img className="profile-avatar" src={currentUser.avatar} alt={currentUser.name} /><div className="profile-content"><h1><Link to="/perfil">{currentUser.name}</Link></h1><p className="muted">{currentUser.handle}</p><p className="profile-bio">{currentUser.bio || "Comparte lo que te inspira."}</p></div></section><nav className="side-nav" aria-label="Tu espacio"><p className="eyebrow">TU ESPACIO</p>{navigation.map(({ to, label }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? "side-link selected" : "side-link"}>{label}</NavLink>)}</nav><p className="copyright">Cavynet para compartir lo que importa.</p></aside>
}
