import { Link } from "react-router-dom"
export default function NotFoundPage() {
  return <main className="auth-container page-card"><p className="eyebrow">ERROR 404</p><h1>Página no encontrada</h1><p>La dirección que buscas no existe.</p><Link className="primary-button" to="/">Volver al inicio</Link></main>
}
