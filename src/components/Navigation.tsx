import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      {/* Dark Green Top Bar */}
      <div className="bg-dark-green h-1 w-full"></div>
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">CL</span>
              </div>
              <div className="text-2xl font-bold text-primary">CityLaw Connect</div>
            </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/lawyers" className="text-secondary hover:text-primary transition-colors">
                Find Lawyers
              </Link>
              <Link to="/chat" className="text-secondary hover:text-primary transition-colors">
                Legal Chat
              </Link>
              <Link to="/resources" className="text-secondary hover:text-primary transition-colors">
                Resources
              </Link>
              <Link to="/cases" className="text-secondary hover:text-primary transition-colors">
                My Cases
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/lawyers"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Lawyers
            </Link>
            <Link
              to="/chat"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Legal Chat
            </Link>
            <Link
              to="/resources"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/cases"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Cases
            </Link>
            <Link
              to="/profile"
              className="block py-2 text-secondary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left py-2 text-secondary hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

