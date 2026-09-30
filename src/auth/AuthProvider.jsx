import { useState } from "react"
import { AuthContext } from "./AuthContext"

const SESSION_KEY = "cavynet-session"
const ACCOUNTS_KEY = "cavynet-accounts"
const demoUser = { name: "Yuliana Pamplona", email: "demo@cavynet.com", handle: "@yulianapamplona", avatar: "https://i.pravatar.cc/120?img=47", bio: "Diseñadora, café y conversaciones que inspiran." }

function readSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem(SESSION_KEY))
    return user && typeof user.name === "string" && typeof user.email === "string" && typeof user.handle === "string" ? user : null
  } catch { return null }
}

async function passwordDigest(email, password) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${email}:${password}`))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Simulación académica local; la autenticación real requiere un servidor.
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  function saveSession(profile) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile))
    setUser(profile)
  }
  async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase()
    if (normalizedEmail === demoUser.email && password === "Cavynet123!") {
      saveSession(demoUser)
      return
    }
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]")
    const hash = await passwordDigest(normalizedEmail, password)
    const account = accounts.find((item) => item.profile.email === normalizedEmail && item.hash === hash)
    if (!account) throw new Error("Correo o contraseña incorrectos.")
    saveSession(account.profile)
  }
  async function register({ name, email, password, birthday, gender }) {
    const normalizedEmail = email.trim().toLowerCase()
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]")
    if (!name.trim()) throw new Error("Escribe tu nombre completo.")
    if (normalizedEmail === demoUser.email || accounts.some((item) => item.profile.email === normalizedEmail)) throw new Error("Ya existe una cuenta con ese correo.")
    const profile = { name: name.trim(), email: normalizedEmail, handle: `@${normalizedEmail.split("@")[0]}`, avatar: demoUser.avatar, bio: "", birthday, gender }
    const hash = await passwordDigest(normalizedEmail, password)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, { profile, hash }]))
    saveSession(profile)
  }
  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }
  function updateProfile(changes) {
    const profile = { ...user, ...changes }
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]")
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.map((account) => account.profile.email === user.email ? { ...account, profile } : account)))
    saveSession(profile)
  }
  return <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
}
