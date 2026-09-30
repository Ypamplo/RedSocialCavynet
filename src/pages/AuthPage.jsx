import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function AuthPage({ registration = false }) {
  const { login, register } = useAuth()
  const location = useLocation()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  async function submit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setError("")
    setPending(true)
    try {
      if (registration) await register(values)
      else await login(values.email, values.password)
    } catch (error) { setError(error instanceof Error ? error.message : "No se pudo iniciar sesión.") }
    finally { setPending(false) }
  }
  return <>
    <header className="topbar"><Link className="brand" to="/"><span className="brand-mark">+</span> cavynet</Link><nav className="auth-nav" aria-label="Acceso"><Link to="/login">Iniciar sesión</Link><Link to="/registro">Registrarse</Link></nav></header>
    <main className="auth-container page-card">
      <p className="eyebrow">TU COMUNIDAD, MÁS CERCA</p>
      <h1>{registration ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <p>{registration ? "Crea tu perfil y empieza a compartir." : "Bienvenido de nuevo a Cavynet."}</p>
      <form className="stack-form" onSubmit={submit}>
        {registration && <label>Nombre completo<input name="name" autoComplete="name" required maxLength={80} /></label>}
        <label>Correo electrónico<input name="email" type="email" autoComplete="email" required /></label>
        <label>Contraseña<input name="password" type="password" autoComplete={registration ? "new-password" : "current-password"} minLength={registration ? 8 : undefined} required /></label>
        {registration && <><label>Fecha de nacimiento<input name="birthday" type="date" max={new Date().toISOString().slice(0, 10)} /></label><label>Género<select name="gender" defaultValue=""><option value="">Prefiero no indicarlo</option><option>Mujer</option><option>Hombre</option><option>Otro</option></select></label></>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={pending}>{pending ? "Un momento…" : registration ? "Registrarse" : "Acceder"}</button>
      </form>
      <p>{registration ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"} <Link className="text-link" state={location.state} to={registration ? "/login" : "/registro"}>{registration ? "Inicia sesión" : "Regístrate aquí"}</Link></p>
      <aside className="demo-note">Demo académica: usa datos de prueba. {registration ? "Las cuentas se guardan en este navegador." : <>Acceso de prueba: <strong>demo@cavynet.com</strong> / <strong>Cavynet123!</strong></>}</aside>
    </main>
  </>
}
