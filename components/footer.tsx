
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
                src="/bha-kaleen2-removebg-preview.png"
                alt="Bhadohi Kaleen Logo"
                width={240}
                height={155}
                className="h-20 md:h-24 lg:h-28 w-auto object-contain"
              />
            </div>
            <p className="text-[#510c74] leading-relaxed opacity-90">
              Crafting timeless product varieties that celebrate life's most precious moments. Quality, elegance, and
              craftsmanship in every design at Bhadohi Kaleen.
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

          {/* Customer Care & Policies (Razorpay Verification Ready) */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#510c74]">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#510c74] mt-1 flex-shrink-0" />
                <div className="text-[#510c74] opacity-90 text-sm">
                  <p className="font-semibold text-gray-900">Bhadohi Kaleen</p>
                  <p>Juhi Niharika Mirage, Sector-10</p>
                  <p>Kharghar, Navi Mumbai, MH - 410210</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#510c74] flex-shrink-0" />
                <a href="tel:+917045932672" className="text-[#510c74] opacity-90 hover:underline text-sm">+91 7045932672</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#510c74] flex-shrink-0" />
                <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] opacity-90 hover:underline text-sm">contact@bhadohikaleen.com</a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#510c74] flex-shrink-0" />
                <span className="text-[#510c74] opacity-90 text-sm">Mon-Sat: 9AM - 8PM</span>
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
        </div>

        {/* Razorpay Trust & Payment Assurance Banner */}
        <div className="border-t border-[#510c74]/15 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/70 border border-[#510c74]/15 shadow-sm">
            <div className="flex items-center space-x-3">
              <Shield className="w-7 h-7 text-[#510c74] flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#240334]">100% Secure Payments powered by Razorpay</p>
                <p className="text-xs text-gray-500">256-bit Bank Grade SSL Encryption • PCI-DSS Level 1 Certified Payment Gateway</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#510c74]">
              <span className="px-2.5 py-1 rounded bg-[#fff4df] border border-[#510c74]/20 shadow-xs">UPI (GPay / PhonePe / Paytm)</span>
              <span className="px-2.5 py-1 rounded bg-[#fff4df] border border-[#510c74]/20 shadow-xs">Credit & Debit Cards</span>
              <span className="px-2.5 py-1 rounded bg-[#fff4df] border border-[#510c74]/20 shadow-xs">NetBanking (50+ Banks)</span>
              <span className="px-2.5 py-1 rounded bg-[#fff4df] border border-[#510c74]/20 shadow-xs">COD Available</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#510c74]/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-[#510c74] opacity-90 text-sm">© 2024 Bhadohi Kaleen. All rights reserved.</p>
            <div className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-[#C9A34E]" />
              <span className="text-[#510c74] opacity-90 text-sm">Authentic Craftsmanship</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm">
            <Link href="/privacy-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/return-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
              Return & Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors font-medium">
              Shipping Policy
            </Link>
            <Link href="/cookies" className="text-[#510c74] opacity-90 hover:text-[#240334] hover:opacity-100 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
