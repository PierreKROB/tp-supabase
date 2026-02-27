import { useNavigate, useLocation } from 'react-router'
import { Button } from '@heroui/react'
import { FileText, LogOut, ShieldCheck, LogIn, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar({ session, isAdmin, signOut }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDarkMode(saved)
    if (saved) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-divider">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <span className="text-xl font-bold">Posts & Comments</span>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 items-center">
        <Button
          onPress={() => navigate('/')}
          variant={pathname === '/' ? 'solid' : 'light'}
          color="primary"
          size="sm"
        >
          Posts
        </Button>
        <Button
          onPress={() => navigate('/stats')}
          variant={pathname === '/stats' ? 'solid' : 'light'}
          color="primary"
          size="sm"
        >
          Stats
        </Button>
      </div>

      {/* User info */}
      <div className="flex gap-2 items-center">
        <Button 
          variant="light" 
          size="sm" 
          isIconOnly
          onPress={toggleDarkMode}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        {session ? (
          <>
            <span className="text-sm text-default-500">{session.user.email}</span>
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-danger text-white px-2 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
            )}
            <Button color="danger" variant="light" size="sm" onPress={signOut}>
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </>
        ) : (
          <Button color="primary" variant="solid" size="sm" onPress={() => navigate('/login')}>
            <LogIn className="w-4 h-4" />
            Connexion
          </Button>
        )}
      </div>
    </nav>
  )
}