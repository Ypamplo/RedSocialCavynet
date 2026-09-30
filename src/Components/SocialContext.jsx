import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { SocialContext } from "./social-context"

const initialPosts = [
  { id: "post-1", author: { name: "Sofia Martinez", avatar: "https://i.pravatar.cc/120?img=32", handle: "@sofia.m" }, createdAt: "Hace 24 min", text: "Una tarde tranquila, un buen cafe y muchas ideas nuevas. A veces las mejores historias empiezan sin planearlas.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80", likes: 128, comments: [{ id: "comment-1", author: "Mateo Ruiz", avatar: "https://i.pravatar.cc/80?img=12", text: "Ese lugar se ve increible. Necesito conocerlo.", likes: 4, replies: [] }], liked: false, shared: false },
  { id: "post-2", author: { name: "Daniel Torres", avatar: "https://i.pravatar.cc/120?img=11", handle: "@daniel.t" }, createdAt: "Hace 1 h", text: "Termine mi primer proyecto del ano. Gracias a quienes acompanaron el proceso y compartieron sus consejos.", likes: 76, comments: [], liked: false, shared: false },
]
function readPosts() { try { return JSON.parse(localStorage.getItem("cavynet-posts")) || initialPosts } catch { return initialPosts } }
export function SocialProvider({ children }) {
  const { user: currentUser } = useAuth()
  const [posts, setPosts] = useState(readPosts)
  useEffect(() => localStorage.setItem("cavynet-posts", JSON.stringify(posts)), [posts])
  function addPost(text) { const clean = text.trim(); if (!clean) return; setPosts((items) => [{ id: `post-${Date.now()}`, author: currentUser, createdAt: "Ahora", text: clean, likes: 0, comments: [], liked: false, shared: false }, ...items]) }
  function toggleLike(id) { setPosts((items) => items.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post)) }
  function toggleShare(id) { setPosts((items) => items.map((post) => post.id === id ? { ...post, shared: !post.shared } : post)) }
  function addComment(postId, text, parentId = null) { const clean = text.trim(); if (!clean) return; setPosts((items) => items.map((post) => { if (post.id !== postId) return post; const comment = { id: `comment-${Date.now()}`, author: currentUser.name, avatar: currentUser.avatar, text: clean, likes: 0, replies: [] }; if (!parentId) return { ...post, comments: [...post.comments, comment] }; return { ...post, comments: post.comments.map((item) => item.id === parentId ? { ...item, replies: [...item.replies, comment] } : item) } })) }
  function likeComment(postId, commentId, parentId = null) { setPosts((items) => items.map((post) => { if (post.id !== postId) return post; const update = (item) => item.id === commentId ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item; return parentId ? { ...post, comments: post.comments.map((item) => item.id === parentId ? { ...item, replies: item.replies.map(update) } : item) } : { ...post, comments: post.comments.map(update) } })) }
  return <SocialContext.Provider value={{ posts, currentUser, addPost, toggleLike, toggleShare, addComment, likeComment }}>{children}</SocialContext.Provider>
}
