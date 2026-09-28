
"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock, Shield, Truck, CreditCard, Star, Heart, Gift, Crown } from "lucide-react"

export default function Footer() {

  return (
    <footer className="text-[#510c74] border-t border-[#510c74]/10" style={{ backgroundColor: '#fff4df' }}>


      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Image
                src="/mariyae_dark_wbg.png"
                alt="Mariyae Kalin Logo"
                width={400}
                height={150}
                className="h-24 md:h-32 lg:h-40 w-auto object-contain"
              />
            </div>
            <p className="text-[#510c74] leading-relaxed opacity-90">
              Crafting timeless product varieties that celebrate life's most precious moments. Quality, elegance, and
              craftsmanship in every design at Mariyae Kalin.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1AMKFMB1Bi/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#510c74]/10 border border-[#510c74]/30 rounded-full flex items-center justify-center hover:bg-[#510c74] hover:border-[#510c74] transition-colors text-[#510c74] hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/mariyae2026?utm_source=qr&igsh=eDJ5dWUxOXE1b2x6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#510c74]/10 border border-[#510c74]/30 rounded-full flex items-center justify-center hover:bg-[#510c74] hover:border-[#510c74] transition-colors text-[#510c74] hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#510c74]/10 border border-[#510c74]/30 rounded-full flex items-center justify-center hover:bg-[#510c74] hover:border-[#510c74] transition-colors text-[#510c74] hover:text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#510c74]/10 border border-[#510c74]/30 rounded-full flex items-center justify-center hover:bg-[#510c74] hover:border-[#510c74] transition-colors text-[#510c74] hover:text-white"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#510c74] mt-1" />
                <div className="text-[#510c74] opacity-90">
                  <p>Juhi Niharika Mirage, Sector-10</p>
                  <p>Kharghar, Navi Mumbai - 410210</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#510c74]" />
                <span className="text-[#510c74] opacity-90">+91 7045932672</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#510c74]" />
                <span className="text-[#510c74] opacity-90">info@mariyae.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#510c74]" />
                <span className="text-[#510c74] opacity-90">Mon-Sat: 9AM-8PM</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/necklaces" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/pendants" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Pendants
                </Link>
              </li>
              <li>
                <Link href="/rings" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/earrings" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/bracelets" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/wedding" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Wedding Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Offers */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Special Offers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/new-arrivals" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link href="/limited-edition" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Limited Edition
                </Link>
              </li>
              <li>
                <Link href="/personalized" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Personalized Product Varieties
                </Link>
              </li>
              <li>
                <Link href="/luxury-collection" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link href="/bridal-sets" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Bridal Sets
                </Link>
              </li>
            </ul>
          </div>
        </div>



        {/* Payment Partners & Security Trust Section */}
        <div className="border-t border-[#510c74]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-[#510c74]/15">
            <div className="flex items-center space-x-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-[#510c74]/10 flex items-center justify-center flex-shrink-0 text-[#510c74]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#240334] flex items-center gap-1.5 justify-center md:justify-start">
                  <span>100% Secure Payments</span>
                  <span className="text-[10px] font-bold bg-[#510c74] text-white px-2 py-0.5 rounded-full uppercase">Powered by Razorpay</span>
                </p>
                <p className="text-xs text-gray-600">256-bit bank-grade encryption • UPI, Cards, NetBanking & COD</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                ⚡ UPI / QR
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                💳 Visa
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                💳 Mastercard
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                🇮🇳 RuPay
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                🏦 Net Banking
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white rounded-md border border-[#510c74]/20 text-[#240334] shadow-xs">
                💵 Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#510c74]/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-[#510c74] opacity-90 text-sm">© 2024 Mariyae Kalin. All rights reserved.</p>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-[#510c74]" />
              <span className="text-[#510c74] opacity-90 text-sm">Premium Quality Since 1998</span>
            </div>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
