import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import PostList from './pages/PostList'
import Stats from './pages/Stats'
import NotFound from './pages/NotFound'

export default function App() {
  const { session, loading, isAdmin, signOut } = useAuth()

  if (loading) return null

  return (
    <BrowserRouter>
      <Navbar session={session} isAdmin={isAdmin} signOut={signOut} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PostList session={session} isAdmin={isAdmin} />} />
          <Route path="/login" element={session ? <Navigate to="/" /> : <Auth />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}