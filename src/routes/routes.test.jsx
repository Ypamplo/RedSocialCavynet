// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom"
import App from "../App"

function LocationProbe() {
  const location = useLocation()
  const navigate = useNavigate()
  return <><output data-testid="location">{location.pathname}{location.search}{location.hash}</output><button onClick={() => navigate(-1)}>Atrás de prueba</button></>
}
function open(path) { return render(<MemoryRouter initialEntries={[path]}><App /><LocationProbe /></MemoryRouter>) }
async function login(user, email = "demo@cavynet.com", password = "Cavynet123!") {
  await user.type(screen.getByLabelText("Correo electrónico"), email)
  await user.type(screen.getByLabelText("Contraseña"), password)
  await user.click(screen.getByRole("button", { name: "Acceder" }))
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear() })
afterEach(cleanup)

describe("Rutas de Cavynet", () => {
  it.each(["/", "/inicio", "/perfil", "/chat", "/mensajes", "/grupos", "/configuracion"])("protege el acceso directo a %s", async (path) => {
    open(path)
    expect(await screen.findByRole("heading", { name: "Iniciar sesión" })).toBeTruthy()
    expect(screen.getByTestId("location").textContent).toBe("/login")
  })
  it("rechaza credenciales incorrectas", async () => {
    const user = userEvent.setup()
    open("/login")
    await login(user, "demo@cavynet.com", "incorrecta")
    expect(await screen.findByRole("alert")).toBeTruthy()
    expect(screen.getByTestId("location").textContent).toBe("/login")
    expect(sessionStorage.getItem("cavynet-session")).toBeNull()
  })
  it("recupera destino, consulta y fragmento, y conserva la sesión al remontar", async () => {
    const user = userEvent.setup()
    const view = open("/grupos?buscar=web#sugeridos")
    await login(user)
    await screen.findByRole("heading", { name: "Grupos", exact: true })
    expect(screen.getByTestId("location").textContent).toBe("/grupos?buscar=web#sugeridos")
    view.unmount()
    open("/perfil")
    expect(await screen.findByRole("heading", { name: "Mi perfil" })).toBeTruthy()
  })
  it("permite navegar, cierra sesión y bloquea volver con Atrás", async () => {
    const user = userEvent.setup()
    open("/login")
    await login(user)
    await screen.findByRole("heading", { name: "Inicio" })
    for (const [label, heading] of [["Mi perfil", "Mi perfil"], ["Mensajes", "Mensajes"], ["Grupos", "Grupos"], ["Configuración", "Configuración de la cuenta"]]) {
      await user.click(screen.getAllByRole("link", { name: label, exact: true })[0])
      expect(await screen.findByRole("heading", { name: heading, exact: true })).toBeTruthy()
    }
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    expect(sessionStorage.getItem("cavynet-session")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Atrás de prueba" }))
    expect(await screen.findByRole("heading", { name: "Iniciar sesión" })).toBeTruthy()
  })
  it.each(["/login", "/registro"])("redirige %s si ya existe una sesión", async (path) => {
    const user = userEvent.setup()
    const view = open("/login")
    await login(user)
    await screen.findByRole("heading", { name: "Inicio" })
    view.unmount()
    open(path)
    expect(await screen.findByRole("heading", { name: "Inicio" })).toBeTruthy()
  })
  it("registra una cuenta, conserva su destino y permite volver a iniciar sesión", async () => {
    const user = userEvent.setup()
    open("/perfil")
    await user.click(screen.getByRole("link", { name: "Regístrate aquí" }))
    await user.type(screen.getByLabelText("Nombre completo"), "Ana Prueba")
    await user.type(screen.getByLabelText("Correo electrónico"), "ana@example.com")
    await user.type(screen.getByLabelText("Contraseña"), "Prueba123!")
    await user.click(screen.getByRole("button", { name: "Registrarse" }))
    expect(await screen.findByRole("heading", { name: "Mi perfil" })).toBeTruthy()
    expect(localStorage.getItem("cavynet-accounts")).not.toContain("Prueba123!")
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    await login(user, "ana@example.com", "Prueba123!")
    expect(await screen.findByRole("heading", { name: "Mi perfil" })).toBeTruthy()
    expect(screen.getAllByText("Ana Prueba").length).toBeGreaterThan(0)
  })
  it("ignora una sesión dañada y muestra 404 para una URL desconocida", async () => {
    sessionStorage.setItem("cavynet-session", "{bad")
    const view = open("/perfil")
    expect(await screen.findByRole("heading", { name: "Iniciar sesión" })).toBeTruthy()
    view.unmount()
    open("/no-existe")
    await waitFor(() => expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeTruthy())
  })
})
