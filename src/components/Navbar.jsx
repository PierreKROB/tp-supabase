import { Link, useLocation } from 'react-router'
import { Button } from '@heroui/react'

export default function Navbar({ session, isAdmin, signOut }) {
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-divider">
      {/* Logo */}
      <span className="text-xl font-bold">📝 Posts & Comments</span>

      {/* Navigation */}
      <div className="flex gap-2 items-center">
        <Button
          as={Link}
          to="/"
          variant={pathname === '/' ? 'solid' : 'light'}
          color="primary"
          size="sm"
        >
          Posts
        </Button>
        <Button
          as={Link}
          to="/stats"
          variant={pathname === '/stats' ? 'solid' : 'light'}
          color="primary"
          size="sm"
        >
          Stats
        </Button>
      </div>

      {/* User info */}
      <div className="flex gap-2 items-center">
        {session ? (
          <>
            <span className="text-sm text-default-500">{session.user.email}</span>
            {isAdmin && (
              <span className="text-xs bg-danger text-white px-2 py-1 rounded-full">
                Admin
              </span>
            )}
            <Button color="danger" variant="light" size="sm" onPress={signOut}>
              Déconnexion
            </Button>
          </>
        ) : (
          <span className="text-sm text-default-400">Non connecté</span>
        )}
      </div>
    </nav>
  )
}