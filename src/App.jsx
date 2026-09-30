import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import AuthProvider from "./auth/AuthProvider"
import { SocialProvider } from "./Components/SocialContext"
import Navbar from "./Components/Navbar"
import ProfileSidebar from "./Components/ProfileSidebar"
import Feed from "./Components/Feed"
import RightSidebar from "./Components/RightSidebar"
import { GuestRoute, PrivateRoute } from "./routes/RouteGuards"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"
import GroupsPage from "./pages/GroupsPage"
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage"
import NotFoundPage from "./pages/NotFoundPage"
import "./index.css"

function SocialLayout() {
  return <SocialProvider><Navbar /><main className="social-layout"><ProfileSidebar /><Outlet /><RightSidebar /></main></SocialProvider>
}

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<Navigate to="/inicio" replace />} />
    <Route element={<GuestRoute />}>
      <Route path="/login" element={<AuthPage key="login" />} />
      <Route path="/registro" element={<AuthPage key="registro" registration />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route element={<SocialLayout />}>
        <Route path="/inicio" element={<Feed />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/mensajes" element={<Navigate to="/chat" replace />} />
        <Route path="/grupos" element={<GroupsPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></AuthProvider>
}
