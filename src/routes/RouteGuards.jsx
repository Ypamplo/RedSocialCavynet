import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export function PrivateRoute() {
  const { user } = useAuth()
  const location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function GuestRoute() {
  const { user } = useAuth()
  const location = useLocation()
  const from = location.state?.from
  const destination = from?.pathname?.startsWith("/") && !from.pathname.startsWith("//") && !["/login", "/registro"].includes(from.pathname)
    ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/inicio"
  return user ? <Navigate to={destination} replace /> : <Outlet />
}
