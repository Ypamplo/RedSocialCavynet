# Cavynet · Rutas en React

Actividad de rutas y rutas restringidas. Las páginas toman como referencia los HTML de `paginas red` y conservan el diseño de Cavynet.

## Ejecutar

```sh
npm install
npm run dev
```

Cuenta de demostración: **demo@cavynet.com** / **Cavynet123!**. También puedes crear una cuenta de prueba desde Registro.

## Rutas

| URL | Página | Acceso |
| --- | --- | --- |
| `/` | Redirige a Inicio | Solicita sesión |
| `/login` | Iniciar sesión | Invitados |
| `/registro` | Crear cuenta | Invitados |
| `/inicio` | Feed y publicaciones | Privado |
| `/perfil` | Mi perfil y mis publicaciones | Privado |
| `/chat` | Conversaciones | Privado |
| `/mensajes` | Redirige a Chat | Privado |
| `/grupos` | Mis grupos y sugerencias | Privado |
| `/configuracion` | Perfil y preferencias | Privado |
| Cualquier otra URL | Página 404 | Público |

`main.jsx` monta `BrowserRouter`. `App.jsx` declara las rutas; `PrivateRoute` verifica la sesión y utiliza `Outlet` para mostrar las páginas autorizadas. Si no hay sesión, `Navigate` lleva al login y guarda el destino (incluidos consulta y fragmento). Después del acceso o registro se recupera ese destino. `GuestRoute` evita mostrar login y registro a usuarios autenticados. Los menús usan `Link` y `NavLink`, sin recargar la página.

La sesión se conserva en `sessionStorage` al recargar la pestaña y se elimina al cerrar sesión. Las cuentas de prueba se guardan en `localStorage`, con un resumen SHA-256 de la contraseña en vez de texto plano. **Es una simulación académica de frontend, no autenticación segura para producción**: un usuario puede modificar el almacenamiento del navegador. Una aplicación real necesita validación, sesiones y autorización en el backend, además de almacenamiento seguro de contraseñas. Usa únicamente datos ficticios. Chat y grupos son demostraciones locales sin comunicación con otras personas; las preferencias de privacidad no aplican controles de servidor.

## Verificación

```sh
npm test
npm run lint
npm run build
```

Las pruebas comprueban acceso directo a rutas privadas, credenciales inválidas, retorno a la URL solicitada, persistencia de sesión, navegación, registro, cierre de sesión, botón Atrás y página 404.

Para probar manualmente, abre `/perfil` sin sesión, inicia sesión y comprueba que vuelves al perfil. Recarga, navega por el menú, cierra sesión y usa Atrás: debe pedir acceso de nuevo.

Al publicar con `BrowserRouter`, configura el alojamiento para servir `index.html` en las rutas de la aplicación; así funcionan los enlaces directos y las recargas. Vite ya lo hace en desarrollo.

Referencia: [rutas declarativas de React Router](https://reactrouter.com/start/declarative/routing).
