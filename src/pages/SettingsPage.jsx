import { useState } from "react"
import { useAuth } from "../auth/AuthContext"

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [tab, setTab] = useState("General")
  const [status, setStatus] = useState("")
  function save(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (tab === "General" && !values.name.trim()) { setStatus("Escribe tu nombre."); return }
    try {
      updateProfile(tab === "General" ? { name: values.name.trim(), bio: values.bio } : tab === "Privacidad" ? { privacy: values } : { notifications: values })
      setStatus("Cambios guardados en este navegador.")
    } catch { setStatus("No se pudieron guardar los cambios.") }
  }
  return <section className="page-content"><h1>Configuración de la cuenta</h1><div className="page-card">
    <div className="contact-list" aria-label="Secciones de configuración">{["General", "Privacidad", "Notificaciones"].map((name) => <button className="secondary-button" aria-pressed={tab === name} key={name} onClick={() => { setTab(name); setStatus("") }}>{name}</button>)}</div>
    <form className="stack-form" onSubmit={save} key={tab}>
      {tab === "General" && <><h2>Información personal</h2><label>Nombre<input name="name" defaultValue={user.name} required maxLength={80} /></label><label>Correo electrónico<input type="email" value={user.email} readOnly /></label><label>Biografía<textarea name="bio" defaultValue={user.bio} rows={3} maxLength={300} /></label></>}
      {tab === "Privacidad" && <><h2>Privacidad</h2><p>Preferencias de demostración; aún no se aplican en un servidor.</p><label>¿Quién puede ver tu perfil?<select name="visibility" defaultValue={user.privacy?.visibility || "Solo amigos"}><option>Todos</option><option>Solo amigos</option><option>Solo yo</option></select></label><label>¿Quién puede enviarte solicitudes?<select name="requests" defaultValue={user.privacy?.requests || "Amigos de amigos"}><option>Todos</option><option>Amigos de amigos</option></select></label></>}
      {tab === "Notificaciones" && <><h2>Preferencias de notificaciones</h2>{["Correo", "Mensajes", "Cumpleaños", "Grupos"].map((name) => <label className="checkbox-label" key={name}><input type="checkbox" name={name} defaultChecked={Boolean(user.notifications?.[name])} />{name}</label>)}</>}
      <button className="primary-button">Guardar cambios</button><p role="status">{status}</p>
    </form>
  </div></section>
}
