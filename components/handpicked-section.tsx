"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function HandpickedSection() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/handpicked?t=${Date.now()}`)
                const data = await response.json()
                if (data.success) {
                    setItems(data.items)
                }
            } catch (error) {
                console.error('Error fetching handpicked items:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [])

    const getSlot = (slot: string) => {
        const item = items.find(i => i.slot === slot)
        if (!item) {
            // Fallbacks
            if (slot === 'left') return { image: '/model-jewelry.jpg', subtitle: 'Signature', title: 'FEATURED VARIETY', link: '/products' }
            if (slot === 'top-right') return { image: '/Gemini_Gener__copy.jpg', subtitle: 'Curated', title: 'PRODUCTS', link: '/products' }
            return { image: '/collections-section.png', subtitle: 'Trending', title: 'COLLECTIONS', link: '/products' }
        }
        return item
    }

    const left = getSlot('left')
    const topRight = getSlot('top-right')
    const bottomRight = getSlot('bottom-right')

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="w-full px-4 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#240334] mb-4">
                        Mariyae Kalin's Signature Collection
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                        An exclusive selection of our product variety, handpicked to define elegance and grace.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[650px]">
                    {/* Left Large Card */}
                    <div className="relative group overflow-hidden rounded-2xl h-[400px] lg:h-full">
                        <Image
                            src={left.image}
                            alt={left.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-10 right-10 text-right pointer-events-none">
                            <h3 className="font-script text-5xl md:text-7xl text-white drop-shadow-2xl" style={{ fontFamily: 'var(--font-allura)' }}>
                                {left.title}
                            </h3>
                        </div>
                        <Link href={left.link} className="absolute inset-0 z-20">
                            <span className="sr-only">View Collection</span>
                        </Link>
                    </div>

                    <div className="grid grid-rows-2 gap-4 h-full">
                        {/* Right Top Card */}
                        <div className="relative group overflow-hidden rounded-2xl h-[300px] lg:h-full">
                            <Image
                                src={topRight.image}
                                alt={topRight.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 right-8 text-right pointer-events-none">
                                <h3 className="font-script text-4xl md:text-5xl text-white drop-shadow-xl" style={{ fontFamily: 'var(--font-allura)' }}>
                                    {topRight.title}
                                </h3>
                            </div>
                            <Link href={topRight.link} className="absolute inset-0 z-20">
                                <span className="sr-only">View Collection</span>
                            </Link>
                        </div>

                        {/* Right Bottom Card */}
                        <div className="relative group overflow-hidden rounded-2xl h-[300px] lg:h-full">
                            <Image
                                src={bottomRight.image}
                                alt={bottomRight.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-[#510c74]/10 mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 right-8 text-right pointer-events-none">
                                <h3 className="font-script text-4xl md:text-5xl text-white drop-shadow-xl" style={{ fontFamily: 'var(--font-allura)' }}>
                                    {bottomRight.title}
                                </h3>
                            </div>
                            <Link href={bottomRight.link} className="absolute inset-0 z-20">
                                <span className="sr-only">View Collection</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
