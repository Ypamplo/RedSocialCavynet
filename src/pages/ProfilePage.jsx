import { Link } from "react-router-dom"
import { useSocial } from "../Components/social-context"
import Feed from "../Components/Feed"

export default function ProfilePage() {
  const { currentUser } = useSocial()
  return <section className="page-content">
    <div className="page-card profile-details">
      <div className="profile-cover" />
      <img className="profile-avatar" src={currentUser.avatar} alt="Mi avatar" />
      <h1>Mi perfil</h1><h2>{currentUser.name}</h2><p className="muted">{currentUser.handle}</p>
      <p>{currentUser.bio || "¡Hola! Ya soy parte de Cavynet."}</p>
      <Link className="primary-button" to="/configuracion">Editar perfil</Link>
    </div>
    <Feed ownOnly />
  </section>
}
