"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-120px)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0507/9865/7726/files/gems-1_2048x2048.jpg?v=1682061576"
          alt="Gems background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-120px)] py-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <p className="text-white text-xl font-light italic opacity-90 tracking-wide drop-shadow-lg">The original</p>
              <h1 className="text-white text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.85] tracking-tight drop-shadow-2xl">
                Shine bright
              </h1>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#510c74] px-8 py-3 font-medium transition-all duration-300 hover:scale-105 drop-shadow-lg"
            >
              Discover Now
            </Button>

            {/* Product Categories */}
            <div className="space-y-6 pt-8">
              <p className="text-white/90 text-lg font-medium drop-shadow-lg">Explore our collections:</p>
              <div className="flex items-center space-x-4 text-white group cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <p className="font-semibold text-lg drop-shadow-lg">Ring</p>
                  <p className="text-sm opacity-80 drop-shadow-lg">& Earring</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-white group cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <p className="font-semibold text-lg drop-shadow-lg">Bangles &</p>
                  <p className="text-sm opacity-80 drop-shadow-lg">Bracelets</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-white group cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <circle cx="12" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <p className="font-semibold text-lg drop-shadow-lg">Drop</p>
                  <p className="text-sm opacity-80 drop-shadow-lg">Necklaces</p>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-8 flex space-x-3">
          <button className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#510c74] transition-all duration-300 hover:scale-110 hover:shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#510c74] transition-all duration-300 hover:scale-110 hover:shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
