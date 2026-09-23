import { SocialProvider } from "./Components/SocialContext"
import Navbar from "./Components/Navbar"
import ProfileSidebar from "./Components/ProfileSidebar"
import Feed from "./Components/Feed"
import RightSidebar from "./Components/RightSidebar"
import "./index.css"

export default function App() {
  return <SocialProvider><Navbar /><main className="social-layout"><ProfileSidebar /><Feed /><RightSidebar /></main></SocialProvider>
}
