"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, User, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"

import CartIcon from "./cart-icon"
import LoginIcon from "./login-icon"
import LoginModal from "./login-modal"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] backdrop-blur-none border-b border-[#510c74]/10" style={{ backgroundColor: '#fff4df', zIndex: 100, position: 'fixed' }}>
      <div className="w-full px-2 md:px-4 lg:px-8 mx-auto">
        {/* Main navbar */}
        <div className="flex items-center justify-center lg:justify-between h-20 md:h-24">
          {/* Mobile Logo - Centered */}
          <div className="lg:hidden flex items-center justify-center w-full h-full">
            <Link href="/" className="flex items-center p-0 h-full pt-4 -ml-4 md:-ml-6">
              <Image
                src="/mariyae_dark_wbg.png"
                alt="Mariyae Kalin Logo"
                width={220}
                height={82}
                className="h-full max-h-16 md:max-h-20 w-auto object-contain scale-110"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-20  ml-40">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 p-0 h-full pt-4 -ml-8 lg:-ml-20">
              <Image
                src="/mariyae_dark_wbg.png"
                alt="Mariyae Kalin Logo"
                width={200}
                height={75}
                className="h-full max-h-14 lg:max-h-16 xl:max-h-20 w-auto object-contain scale-110"
                priority
              />
            </Link>
            {/* Search Bar */}
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search for product variety..."
                className="w-80 xl:w-96 pl-6 pr-2 py-1 rounded-full border border-[#510c74]/30 text-[#240334] placeholder-gray-500 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#510c74]/50 focus:border-[#510c74]/50 text-sm"
              />
              <button type="submit" className="absolute right-2 top-1.5">
                <Search className="w-4 h-4 text-[#510c74]" />
              </button>
            </form>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-[#510c74] hover:text-[#240334] transition-colors font-medium text-sm">
                Home
              </Link>
              <Link href="/products" className="text-[#510c74] hover:text-[#240334] transition-colors font-medium text-sm">
                Products
              </Link>
              <Link href="/about" className="text-[#510c74] hover:text-[#240334] transition-colors font-medium text-sm">
                About
              </Link>
              <Link href="/contact" className="text-[#510c74] hover:text-[#240334] transition-colors font-medium text-sm">
                Contact
              </Link>
              <LoginIcon />
              <CartIcon />
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center space-x-2 md:space-x-3 absolute right-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-[#510c74] hover:text-[#240334] transition-colors p-1"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#510c74] p-1">
              {isMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3 md:pb-4 px-2 md:px-0">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search for product variety..."
                className="w-full px-3 md:px-4 py-2 rounded-full border border-[#510c74]/30 text-[#240334] placeholder-gray-500 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#510c74]/50 focus:border-[#510c74]/50 text-sm md:text-base"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-[#510c74]" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 px-2 md:px-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-[#510c74]/10">
              <div className="flex flex-col space-y-4 md:space-y-6">
                <Link href="/" className="text-[#240334] hover:text-[#510c74] font-medium text-base md:text-lg">
                  Home
                </Link>
                <Link href="/products" className="text-[#240334] hover:text-[#510c74] font-medium text-base md:text-lg">
                  Products
                </Link>
                <Link href="/about" className="text-[#240334] hover:text-[#510c74] font-medium text-base md:text-lg">
                  About
                </Link>
                <Link href="/contact" className="text-[#240334] hover:text-[#510c74] font-medium text-base md:text-lg">
                  Contact
                </Link>
                <div className="flex items-center space-x-3 md:space-x-4 pt-3 md:pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-900" />
                    <span className="text-gray-900 font-medium text-sm">Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-900" />
                    <span className="text-gray-900 font-medium text-sm">Cart</span>
                    {state.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">{state.itemCount}</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => setIsLoginModalOpen(false)}
        />

        {/* Cart Modal for Mobile */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Shopping Cart</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* Cart content would go here - simplified for now */}
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 