"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, X, Star, Heart, Eye, ShoppingCart, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/contexts/cart-context'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: Array<{ url: string; publicId: string }>
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isOnSale: boolean
  offerPercentage?: number
  createdAt?: string
  description?: string
  keyFeatures?: string[]
}

export default function SearchPage() {
  const { products, loading, error } = useProducts()
  const { addItem } = useCart()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Read query from URL parameters on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    if (urlQuery) {
      setQuery(urlQuery)
    }
  }, [searchParams])

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Anklets"]

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const searchTerm = query.toLowerCase()
    const matchesQuery = !query ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.keyFeatures?.some(feature => feature.toLowerCase().includes(searchTerm))

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesQuery && matchesCategory && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setQuery('')
    setSelectedCategories([])
    setPriceRange([0, 10000])
    setSortBy('featured')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Top spacing to prevent navbar overlap */}
        <div className="h-20"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#510c74] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Top spacing to prevent navbar overlap */}
        <div className="h-20"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          {query && (
            <p className="text-gray-600 mb-4">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching your search
            </p>
          )}

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#510c74] focus:border-[#510c74]"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category])
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category))
                            }
                          }}
                          className="rounded border-gray-300 text-[#510c74] focus:ring-[#510c74]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                      <span className="text-sm text-gray-600">-</span>
                      <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-[#510c74] text-[#510c74] hover:bg-[#fff4df]"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-[#fff4df] text-[#510c74]' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-[#fff4df] text-[#510c74]' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Showing {sortedProducts.length} of {products.length} products
                </p>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters} className="bg-[#510c74] hover:bg-[#240334] text-white">Clear All Filters</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''
                      }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {product.isNew && (
                          <span className="bg-[#fff4df] text-[#510c74] border border-[#510c74]/20 px-2 py-1 text-xs font-bold rounded-full">NEW</span>
                        )}
                        {product.isOnSale && (
                          <span className="bg-[#510c74] text-white px-2 py-1 text-xs font-bold rounded-full">SALE</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#fff4df]">
                          <Heart className="w-4 h-4 text-[#510c74]" />
                        </button>
                        <Link href={`/view-details?id=${product._id}`}>
                          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#fff4df]">
                            <Eye className="w-4 h-4 text-[#510c74]" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#510c74] transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-[#510c74]">₹{product.price.toFixed(2)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                          {product.isOnSale && product.offerPercentage && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              {product.offerPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        className="w-full bg-[#510c74] hover:bg-[#240334] text-white"
                        onClick={() => addItem({
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                          category: product.category,
                          brand: "JEWELS BY LAHARI"
                        })}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>

                      {/* View Details Button */}
                      <Link href={`/view-details?id=${product._id}`} className="w-full">
                        <Button variant="outline" className="w-full border-[#510c74] text-[#510c74] hover:bg-[#fff4df]">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
