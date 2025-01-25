'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, User, LogIn, LogOut } from 'lucide-react'
import { isLoggedIn, logout, getUserName } from '@/lib/auth'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    setUserName(getUserName())
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUserName(null)
    router.push('/')
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <Home className="mr-2" />
          RentEase
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/properties" className="hover:text-secondary transition-colors">
                Properties
              </Link>
            </li>
            <li>
              <Link href="/list-property" className="hover:text-secondary transition-colors">
                List Property
              </Link>
            </li>
            {loggedIn ? (
              <>
                <li>
                  <span className="text-secondary">{userName}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-secondary transition-colors flex items-center">
                    <LogOut className="mr-1" size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:text-secondary transition-colors flex items-center">
                    <LogIn className="mr-1" size={18} />
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center">
                    <User className="mr-1" size={18} />
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

