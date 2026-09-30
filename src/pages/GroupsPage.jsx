import { useState } from "react"

const groups = [
  { name: "Diseñadores UI/UX", members: "1.2k", joined: true },
  { name: "Desarrollo Web", members: "3.4k", joined: true },
  { name: "Fotografía Creativa", members: "856", joined: true },
  { name: "Viajeros del mundo", members: "5.1k", joined: false },
  { name: "Tecnología y gadgets", members: "8.2k", joined: false },
  { name: "Cocina fácil", members: "2.7k", joined: false },
]

export default function GroupsPage() {
  const [items, setItems] = useState(groups)
  const [query, setQuery] = useState("")
  return <section className="page-content"><h1>Grupos</h1>
    <label className="stack-form">Buscar grupos<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre del grupo…" /></label>
    {[true, false].map((joined) => <section className="page-card" key={String(joined)}><h2>{joined ? "Mis grupos" : "Grupos sugeridos"}</h2>
      {items.filter((group) => group.joined === joined && group.name.toLowerCase().includes(query.toLowerCase())).map((group) => <article className="group-row" key={group.name}><div><h3>{group.name}</h3><p className="muted">{group.members} miembros</p></div><button className="secondary-button" onClick={() => setItems(items.map((item) => item.name === group.name ? { ...item, joined: !joined } : item))}>{joined ? "Salir" : "Unirse"}</button></article>)}
      {!items.some((group) => group.joined === joined && group.name.toLowerCase().includes(query.toLowerCase())) && <p>No hay grupos para mostrar.</p>}
    </section>)}
  </section>
}
