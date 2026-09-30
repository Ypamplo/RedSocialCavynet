import { useState } from "react"

const contacts = ["Jane Doe", "Angie Jane", "John Doe"]
export default function ChatPage() {
  const [selected, setSelected] = useState(contacts[0])
  const [query, setQuery] = useState("")
  const [text, setText] = useState("")
  const [messages, setMessages] = useState({ "Jane Doe": [{ author: "Jane Doe", text: "¡Hola! ¿Cómo va el diseño?" }, { author: "Tú", text: "Muy bien, casi terminado." }] })
  function send(event) {
    event.preventDefault()
    if (!text.trim()) return
    setMessages({ ...messages, [selected]: [...(messages[selected] || []), { author: "Tú", text: text.trim() }] })
    setText("")
  }
  return <section className="page-content"><h1>Mensajes</h1><p className="muted">Conversaciones de demostración en este navegador.</p>
    <div className="page-card"><h2>Conversaciones</h2><label className="stack-form">Buscar conversación<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="contact-list">{contacts.filter((name) => name.toLowerCase().includes(query.toLowerCase())).map((name) => <button className="secondary-button" aria-pressed={selected === name} key={name} onClick={() => { setSelected(name); setText("") }}>{name}</button>)}</div></div>
    <section className="page-card"><h2>{selected}</h2><div className="message-list" role="log" aria-label={`Conversación con ${selected}`}>{(messages[selected] || []).map((message, index) => <div className={`message-bubble ${message.author === "Tú" ? "own-message" : ""}`} key={index}><strong>{message.author}</strong><p>{message.text}</p></div>)}</div><form className="message-form" onSubmit={send}><input aria-label="Escribe un mensaje" value={text} onChange={(event) => setText(event.target.value)} placeholder="Escribe un mensaje…" /><button className="primary-button" disabled={!text.trim()}>Enviar</button></form></section>
  </section>
}
