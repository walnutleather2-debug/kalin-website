"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-none border-b border-[#510c74]/10" style={{ backgroundColor: '#fff4df' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">


        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-32">
            <Image
              src="/mariyae_without bg.png"
              alt="Mariyae Kalin Logo"
              width={150}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for product variety..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#510c74] focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-[#510c74]" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/" className="flex items-center transition-colors" style={{ color: '#510c74' }} onMouseEnter={(e) => e.currentTarget.style.color = '#240334'} onMouseLeave={(e) => e.currentTarget.style.color = '#510c74'}>
                <span className="font-medium">Home</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>
            <div className="relative group">
              <Link href="/products" className="flex items-center transition-colors" style={{ color: '#510c74' }} onMouseEnter={(e) => e.currentTarget.style.color = '#240334'} onMouseLeave={(e) => e.currentTarget.style.color = '#510c74'}>
                <span className="font-medium">Products</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>
            <Link href="/coupons" className="transition-colors font-medium" style={{ color: '#510c74' }} onMouseEnter={(e) => e.currentTarget.style.color = '#240334'} onMouseLeave={(e) => e.currentTarget.style.color = '#510c74'}>
              Coupons
            </Link>
            <div className="relative group">
              <Link href="/blog" className="flex items-center transition-colors" style={{ color: '#510c74' }} onMouseEnter={(e) => e.currentTarget.style.color = '#240334'} onMouseLeave={(e) => e.currentTarget.style.color = '#510c74'}>
                <span className="font-medium">Blog</span>
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
              </Link>
            </div>
            <Link href="/contact" className="transition-colors font-medium" style={{ color: '#510c74' }} onMouseEnter={(e) => e.currentTarget.style.color = '#240334'} onMouseLeave={(e) => e.currentTarget.style.color = '#510c74'}>
              Contact
            </Link>
          </nav>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="transition-colors text-[#510c74] hover:text-[#240334]"
            >
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#510c74]">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for product variety..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="transition-colors" style={{ color: '#240334' }} onMouseEnter={(e) => e.currentTarget.style.color = '#510c74'} onMouseLeave={(e) => e.currentTarget.style.color = '#240334'}>
                Home
              </Link>
              <Link href="/products" className="transition-colors" style={{ color: '#240334' }} onMouseEnter={(e) => e.currentTarget.style.color = '#510c74'} onMouseLeave={(e) => e.currentTarget.style.color = '#240334'}>
                Products
              </Link>

              <Link href="/coupons" className="transition-colors" style={{ color: '#240334' }} onMouseEnter={(e) => e.currentTarget.style.color = '#510c74'} onMouseLeave={(e) => e.currentTarget.style.color = '#240334'}>
                Coupons
              </Link>
              <Link href="/blog" className="transition-colors" style={{ color: '#240334' }} onMouseEnter={(e) => e.currentTarget.style.color = '#510c74'} onMouseLeave={(e) => e.currentTarget.style.color = '#240334'}>
                Blog
              </Link>
              <Link href="/contact" className="transition-colors" style={{ color: '#240334' }} onMouseEnter={(e) => e.currentTarget.style.color = '#510c74'} onMouseLeave={(e) => e.currentTarget.style.color = '#240334'}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
