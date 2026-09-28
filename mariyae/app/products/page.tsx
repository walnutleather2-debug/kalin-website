"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/useProducts"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import ProductFilters from "@/components/product-filters"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getOptimizedUrl } from "@/lib/cloudinary-client"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  colors: string[]
  sizes: string[]
  isNew: boolean
  isOnSale: boolean
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || undefined
  const initialSubCategory = searchParams.get('subCategory') || undefined

  const { products, loading, fetchProducts } = useProducts({
    category: initialCategory,
    subCategory: initialSubCategory
  })

  const { addItem } = useCart()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 50000],
    materials: [],
    colors: [],
    sizes: [],
    isNew: false,
    isOnSale: false,
  })

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && !filters.categories.includes(categoryFromUrl)) {
      setFilters(prev => ({ ...prev, categories: [categoryFromUrl] }))
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts({
      category: filters.categories.length > 0 ? filters.categories[0] : undefined,
      isNew: filters.isNew,
      isOnSale: filters.isOnSale,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      sortBy: sortBy
    })
  }, [filters.categories, filters.isNew, filters.isOnSale, filters.priceRange, sortBy])

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++
    if (filters.isNew) count++
    if (filters.isOnSale) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      materials: [],
      colors: [],
      sizes: [],
      isNew: false,
      isOnSale: false,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-20"></div>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-serif text-[#240334] mb-4">
              {filters.categories[0] || 'Our Collection'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exquisite product variety crafted for the elegant you.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block lg:w-1/4">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full flex justify-between px-6"
              >
                <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</span>
                {activeFiltersCount > 0 && <span className="bg-[#510c74] text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>}
              </Button>
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                  <ProductFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              )}
            </div>

            <main className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border-none rounded-lg px-4 py-2 text-sm shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-[#510c74]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  {activeFiltersCount > 0 && (
                    <Button onClick={clearAllFilters} variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {loading ? "Updating..." : `${products.length} Items Found`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-3xl h-[450px]" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <Filter className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={clearAllFilters} className="bg-[#510c74] text-white rounded-full px-8 hover:scale-105 transition">Clear All Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product._id} className="group block">
                      <Link
                        href={product.isOutOfStock ? "#" : `/view-details?id=${product._id}`}
                        className={`relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 block ${product.isOutOfStock ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <Image
                          src={getOptimizedUrl(product.images[0]?.url || "/placeholder.svg", { width: 500 })}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {product.isOutOfStock && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <div className="bg-white/90 text-[#510c74] px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-[#510c74]">
                              OUT OF STOCK
                            </div>
                          </div>
                        )}
                        {product.isOnSale && !product.isOutOfStock && (
                          <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {product.offerPercentage}% OFF
                          </div>
                        )}
                        {!product.isOutOfStock && (
                          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <Button
                              className="bg-white text-gray-900 hover:bg-[#fff4df] rounded-full"
                              onClick={(e) => {
                                e.preventDefault();
                                addItem({
                                  id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  originalPrice: product.originalPrice,
                                  image: product.images[0]?.url || "/placeholder.svg",
                                  category: product.category,
                                  brand: "MARIYAE KALIN"
                                });
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </Link>
                      <div className="mt-6 space-y-2">
                        <p className="text-xs uppercase tracking-widest text-[#C9A34E] font-bold">{product.category}</p>
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#510c74] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-[#510c74]">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
