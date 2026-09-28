"use client"

import { useState, useEffect, useRef } from "react"
import { User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LoginModal from "./login-modal"

interface User {
  _id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
}

export default function LoginIcon() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const userDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mariyae_user_data')
    const authStatus = localStorage.getItem('mariyae_user_auth')
    if (authStatus === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser({
          _id: userData._id || '',
          name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          firstName: userData.firstName,
          lastName: userData.lastName
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
    setIsLoginModalOpen(false)
    // Store user data in localStorage
    localStorage.setItem('mariyae_user_data', JSON.stringify(userData))
    localStorage.setItem('mariyae_user_auth', 'true')
    router.refresh()
  }

  const handleUserDropdownEnter = () => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current)
      userDropdownTimeoutRef.current = null
    }
    // Calculate dropdown position based on button position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8, // 8px = mt-2 equivalent
        right: window.innerWidth - rect.right
      })
    }
    setIsUserDropdownOpen(true)
  }

  const handleUserDropdownLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false)
    }, 200)
  }

  const handleLogout = () => {
    setUser(null)
    setIsUserDropdownOpen(false)
    // Clear any stored data
    localStorage.removeItem('mariyae_user_auth')
    localStorage.removeItem('mariyae_user_data')
    router.push('/')
    router.refresh()
  }

  // Update dropdown position on window resize
  useEffect(() => {
    const updatePosition = () => {
      if (isUserDropdownOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        })
      }
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isUserDropdownOpen])

  return (
    <>
      <div className="relative">
        {user ? (
          // User is logged in - show dropdown button
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => {
                if (buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect()
                  setDropdownPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                  })
                }
                setIsUserDropdownOpen(!isUserDropdownOpen)
              }}
              onMouseEnter={handleUserDropdownEnter}
              onMouseLeave={handleUserDropdownLeave}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 transition-colors cursor-pointer group"
            >
              <User className="w-4 h-4 md:w-5 md:h-5 text-[#510c74] group-hover:text-[#240334]" />
              <span className="text-[#510c74] group-hover:text-[#240334] text-xs md:text-sm font-medium hidden sm:block">
                {user.name}
              </span>
            </button>

            {/* User Dropdown - Fixed positioning to escape navbar clipping */}
            {isUserDropdownOpen && (
              <div
                className="fixed w-72 rounded-xl shadow-2xl border overflow-hidden"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
                style={{
                  zIndex: 99999,
                  position: 'fixed',
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                  background: '#fff4df',
                  borderColor: '#510c74'
                }}
              >
                {/* User Info Header */}
                <div className="p-5" style={{ background: 'linear-gradient(90deg, #510c74, #240334)' }}>
                  <div className="flex items-center space-x-4">
                    {/* Avatar Icon */}
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    {/* User Information */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-white truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm truncate mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {user.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3">
                  {/* Accounts Link */}
                  <Link
                    href="/account"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-[#fff4df]"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-colors bg-[#510c74]/10 group-hover:bg-[#510c74]">
                      <User className="h-4 w-4" style={{ color: '#510c74' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#510c74' }}>
                      Accounts
                    </span>
                  </Link>

                  {/* Separator */}
                  <div className="my-2" style={{ borderTop: '1px solid rgba(81, 12, 116, 0.2)' }}></div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-[#fff4df]"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-colors bg-[#510c74]/10 group-hover:bg-[#510c74]">
                      <LogOut className="h-4 w-4" style={{ color: '#510c74' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#510c74' }}>
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // User is not logged in - show login button
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 transition-colors text-[#510c74] hover:text-[#240334] group"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium hidden sm:block">Login</span>
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
