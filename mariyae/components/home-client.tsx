"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Heart, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import HandpickedSection from "@/components/handpicked-section"
import { getOptimizedUrl } from "@/lib/cloudinary-client"

interface HomeClientProps {
    banners: any[]
    initialProducts: any[]
    mainCategories: any[]
}

const renderBannerSlide = (banner: any, index: number): JSX.Element => {
    const hasContent = !!(banner.headline || banner.description || banner.eyebrowText)
    const isSimple = !hasContent

    const isReversed = banner.layoutType === 'reversed'
    const gridCols = isReversed ? 'lg:grid-cols-[0.95fr_1.05fr]' : 'lg:grid-cols-[1.05fr_0.95fr]'
    const textOrder = isReversed ? 'order-1 lg:order-2' : ''
    const imageOrder = isReversed ? 'order-2 lg:order-1' : ''
    const gradientDirection = isReversed ? 'to left' : 'to right'
    const imagePosition = isReversed ? 'lg:justify-start' : 'lg:justify-end'
    const decorativePosition = isReversed ? 'left-8 lg:left-16' : 'right-8 lg:right-16'
    const gradientPosition = isReversed ? 'right-0 lg:right-[-80px]' : 'left-0 lg:left-[-80px]'
    const gradientCalc = isReversed ? 'lg:w-[calc(100%+80px)]' : 'lg:w-[calc(100%+80px)]'

    if (isSimple) {
        return (
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] group cursor-pointer bg-white flex items-center justify-center">
                <Link href={banner.button1Link || "/products"} className="absolute inset-0 z-20" aria-label={banner.headline || "Promotion"} />
                <div className="relative w-full h-full overflow-hidden">
                    {banner.backgroundImage ? (
                        <Image
                            src={getOptimizedUrl(banner.backgroundImage, { quality: 'auto' })}
                            alt={banner.headline || 'Banner'}
                            fill
                            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                            priority={index === 0}
                            sizes="100vw"
                        />
                    ) : (
                        <Image
                            src="/placeholder.svg"
                            alt={banner.headline || 'Banner'}
                            fill
                            className="h-full w-full object-contain"
                            priority={index === 0}
                            sizes="100vw"
                        />
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-[500px] sm:min-h-[550px] md:min-h-[620px] w-full">
            <div className="absolute inset-0">
                {banner.backgroundImage ? (
                    <Image
                        src={getOptimizedUrl(banner.backgroundImage, { quality: 'auto' })}
                        alt={banner.headline || 'Banner'}
                        fill
                        className="h-full w-full object-cover"
                        priority={index === 0}
                        sizes="100vw"
                    />
                ) : (
                    <Image
                        src="/placeholder.svg"
                        alt={banner.headline || 'Banner'}
                        fill
                        className="h-full w-full object-cover"
                        priority={index === 0}
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(103, 0, 153, 0.95), rgba(81, 12, 116, 0.85), rgba(36, 3, 52, 0.60))' }} />
            </div>

            <div className="relative z-10 flex h-full w-full items-stretch">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid gap-6 sm:gap-8 lg:gap-12 ${gridCols}`}>
                        <div className={`flex flex-col justify-center items-center text-center py-6 sm:py-8 md:py-12 lg:py-16 pt-12 sm:pt-16 md:pt-20 lg:pt-24 ${textOrder}`}>
                            <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
                                <span className="h-1 w-8 sm:w-12" style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)' }} />
                                <span className="h-1 w-3 sm:w-4" style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)' }} />
                                <span className="h-1 w-2" style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)' }} />
                            </div>

                            {banner.eyebrowText && (
                                <span className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                                    {banner.eyebrowText}
                                </span>
                            )}

                            {banner.headline && (
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight">
                                    {banner.headline}
                                </h1>
                            )}

                            {banner.description && (
                                <p className="mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-white/85">
                                    {banner.description}
                                </p>
                            )}

                            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4">
                                {banner.button1Text && (
                                    <Link
                                        href={banner.button1Link || '/products'}
                                        className="inline-flex items-center justify-center rounded-md px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide shadow-md transition whitespace-nowrap"
                                        style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
                                    >
                                        {banner.button1Text}
                                    </Link>
                                )}
                                {banner.button2Text && (
                                    <Link
                                        href={banner.button2Link || '/products'}
                                        className="inline-flex items-center justify-center rounded-md bg-[#3f3f3f] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide shadow-md transition hover:bg-[#1f1f1f] whitespace-nowrap"
                                        style={{ color: '#C9A34E' }}
                                    >
                                        {banner.button2Text}
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className={`relative min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[400px] items-center justify-center ${imagePosition} flex mt-4 lg:mt-0 ${imageOrder}`}>
                            <div className={`absolute inset-y-16 ${decorativePosition} w-3 lg:w-4 rounded hidden lg:block`} style={{ backgroundColor: '#C9A34E', opacity: 0.8 }} />
                            <div className={`absolute bottom-12 lg:bottom-20 ${decorativePosition} h-8 lg:h-12 w-3 lg:w-4 rounded hidden lg:block`} style={{ backgroundColor: '#C9A34E', opacity: 0.8 }} />
                            <div className={`absolute top-8 lg:top-16 ${decorativePosition} h-16 w-16 lg:h-24 lg:w-24 hidden lg:block`} style={{ backgroundColor: '#C9A34E', opacity: 0.4 }} />
                            <div className={`absolute ${gradientPosition} top-0 h-full w-full ${gradientCalc}`} style={{ background: `linear-gradient(${gradientDirection}, transparent, rgba(201, 163, 78, 0.15), transparent)` }} />

                            {banner.decorativeImage && (
                                <div className="relative h-[85%] w-[85%] max-h-[350px] max-w-[450px] overflow-hidden rounded-lg lg:rounded-none mx-auto scale-110 hover:scale-115 transition-transform duration-700">
                                    <Image
                                        src={getOptimizedUrl(banner.decorativeImage, { width: 800, quality: 'auto' })}
                                        alt={banner.headline || 'Banner'}
                                        fill
                                        className="h-full w-full object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HomeClient({ banners, initialProducts, mainCategories }: HomeClientProps) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [categories, setCategories] = useState(mainCategories)
    const [subCategories, setSubCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isViewingSubCategories, setIsViewingSubCategories] = useState(false)
    const [activeCard, setActiveCard] = useState<string | null>(null)
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const latestGems = initialProducts.slice(0, 8)
    const featuredProducts = initialProducts.filter(p => p.isNew || p.isOnSale).slice(0, 4)

    useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    useEffect(() => {
        if (!api) return
        const interval = setInterval(() => {
            const selectedIndex = api.selectedScrollSnap()
            const slideCount = api.slideNodes().length
            if (selectedIndex === slideCount - 1) {
                api.scrollTo(0, false)
            } else {
                api.scrollNext()
            }
        }, 5500)
        return () => clearInterval(interval)
    }, [api])

    const toggleFavorite = (productId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setFavorites(prev => {
            const next = new Set(prev)
            next.has(productId) ? next.delete(productId) : next.add(productId)
            return next
        })
    }

    const handleCategoryClick = async (categoryName: string, categoryId: string) => {
        setActiveCard(categoryName)
        setSelectedCategory(categoryName)
        try {
            const response = await fetch(`/api/categories/sub?mainCategory=${encodeURIComponent(categoryName)}`)
            const data = await response.json()
            if (data.success && data.subCategories) {
                setSubCategories(data.subCategories)
                setIsViewingSubCategories(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubCategoryClick = (subCategoryName: string) => {
        window.location.href = `/products?subCategory=${encodeURIComponent(subCategoryName)}`
    }

    const handleBackToCategories = () => {
        setSelectedCategory(null)
        setIsViewingSubCategories(false)
        setActiveCard(null)
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <section className="h-16 md:h-20" style={{ backgroundColor: '#0F4F3F' }}>
                <div className="h-full flex items-center justify-center px-4">
                    <p className="text-[#F3EDE4] text-xs md:text-sm font-medium text-center">Welcome to Mariyae Kalin - Premium Product Variety Collection</p>
                </div>
            </section>

            <section className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-hidden bg-white">
                <Carousel setApi={setApi} opts={{ loop: true, duration: 25 }} className="w-full">
                    <CarouselContent>
                        {banners.length > 0 ? (
                            banners.map((banner, index) => (
                                <CarouselItem key={banner._id}>
                                    {renderBannerSlide(banner, index)}
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                {renderBannerSlide({ headline: "Exquisite Product Variety", backgroundImage: "/Gemini_Gener__copy.jpg" }, 0)}
                            </CarouselItem>
                        )}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-white/80" />
                    <CarouselNext className="right-2" style={{ backgroundColor: '#fff4df' }} />
                </Carousel>
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, i) => (
                        <button key={i} onClick={() => api?.scrollTo(i)} className={`h-2 rounded-full transition-all ${current === i ? "w-8 bg-[#510c74]" : "w-2 bg-[#510c74]/40"}`} />
                    ))}
                </div>
            </section>

            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#240334] mb-4">Latest Gems</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {latestGems.map((product) => (
                            <div key={product._id} className="group relative bg-white rounded-2xl overflow-hidden shadow-md">
                                <Link
                                    href={product.isOutOfStock ? "#" : `/view-details?id=${product._id}`}
                                    className={`${product.isOutOfStock ? 'cursor-default' : 'cursor-pointer'} block`}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                        <Image src={getOptimizedUrl(product.images[0]?.url || "/placeholder.svg", { width: 400 })} alt={product.name} fill className="object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                        <Image src={getOptimizedUrl(product.images[1]?.url || product.images[0]?.url || "/placeholder.svg", { width: 400 })} alt={product.name} fill className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                        {product.isOutOfStock && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                                                <div className="bg-white/90 text-[#510c74] px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-[#510c74]">
                                                    OUT OF STOCK
                                                </div>
                                            </div>
                                        )}
                                        <button onClick={(e) => toggleFavorite(product._id, e)} className="absolute top-3 right-3 p-2 bg-white rounded-full z-20"><Heart className={`h-5 w-5 ${favorites.has(product._id) ? "fill-red-500 text-red-500" : ""}`} /></button>
                                    </div>
                                    <div className="p-4 text-left">
                                        <p className="text-xs uppercase text-gray-500">{product.category}</p>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#510c74]">{product.name}</h3>
                                        <div className="flex gap-2 font-bold text-[#510c74]">₹{product.price}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link href="/products" className="inline-block mt-12 bg-[#fff4df] border border-[#510c74] text-[#510c74] px-8 py-3 rounded-full hover:scale-105 transition">View All Latest Gems</Link>
                </div>
            </section>

            <HandpickedSection />

            <section className="py-20 px-8" style={{ backgroundColor: '#eae0cc' }}>
                <h2 className="text-center text-3xl md:text-5xl font-serif mb-10 text-[#240334]">Shop by Category</h2>
                {!isViewingSubCategories ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat: any) => (
                            <div key={cat.id} onClick={() => handleCategoryClick(cat.name, cat.id)} className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                                <Image src={getOptimizedUrl(cat.image || "/placeholder.svg", { width: 600 })} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                                    <h3 className="text-2xl font-bold uppercase">{cat.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Button onClick={handleBackToCategories} variant="outline" className="mb-8 border-[#C9A34E] text-[#C9A34E]">Back to Categories</Button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {subCategories.map((sub: any) => (
                                <div key={sub._id} onClick={() => handleSubCategoryClick(sub.name)} className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                                    <Image src={getOptimizedUrl(sub.image || "/placeholder.svg", { width: 600 })} alt={sub.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                                        <h3 className="text-2xl font-bold uppercase">{sub.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-[#240334] mb-4">Featured Collection</h2>
                    <p className="text-gray-500 mb-12">Handpicked pieces that define elegance and luxury.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <div key={product._id} className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                                <Link
                                    href={product.isOutOfStock ? "#" : `/view-details?id=${product._id}`}
                                    className={`${product.isOutOfStock ? 'cursor-default' : 'cursor-pointer'} block`}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                        <Image src={getOptimizedUrl(product.images[0]?.url || "/placeholder.svg", { width: 400 })} alt={product.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                                        {product.isOutOfStock && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                                                <div className="bg-white/90 text-[#510c74] px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-[#510c74]">
                                                    OUT OF STOCK
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="bg-[#510c74] text-white text-[10px] font-bold tracking-tighter px-3 py-1 rounded-full uppercase">Featured</div>
                                        </div>
                                    </div>
                                    <div className="p-6 text-left bg-white">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#510c74] transition-colors">{product.name}</h3>
                                        <div className="mt-2 text-[#510c74] font-bold text-lg">₹{product.price}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center p-8 md:p-12 border border-[#510c74]/15" style={{ backgroundColor: '#fff4df' }}>
                            <Image 
                                src="/mariyae_dark_wbg.png" 
                                alt="Mariyae Kalin Logo" 
                                fill 
                                className="object-contain p-8 md:p-12 drop-shadow-md hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-6xl font-serif text-[#240334]">Elegance in Every Detail</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At Mariyae Kalin, our product variety is not just an adornment; it's an expression of your style.
                                We craft pieces that tell stories, celebrate milestones, and enhance the natural beauty of every individual.
                            </p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-200">
                                <div>
                                    <div className="text-3xl font-bold text-[#510c74]">10K+</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Happy Clients</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#510c74]">15+</div>
                                    <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Years Experience</div>
                                </div>
                            </div>
                            <Button size="lg" className="bg-[#510c74] text-white rounded-full px-10 py-6 text-lg hover:scale-105 transition">Discover Our Story</Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
