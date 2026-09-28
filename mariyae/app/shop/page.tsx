"use client"

import Navbar from "@/components/navbar"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Eye, ShoppingCart, Star } from "lucide-react"

export default function ShopPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string | null>(null)
  const [subCategories, setSubCategories] = useState<Array<{ id: string, name: string, count: number, image: string, mainCategory: string }>>([])
  const [isViewingSubCategories, setIsViewingSubCategories] = useState(false)
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const [categories, setCategories] = useState<Array<{ id: string, name: string, count: number, image: string }>>([])

  // Fetch main categories from database (same logic as home page)
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await fetch('/api/categories/main')
        const data = await response.json()

        if (data.success && data.categories) {
          // Count products per main category
          const categoriesWithCounts = data.categories.map((mainCat: any) => {
            // Count products that match this main category name
            const count = products.filter(p =>
              p.category === mainCat.name ||
              p.mainCategory === mainCat.name
            ).length

            return {
              id: mainCat._id,
              name: mainCat.name,
              count: count,
              image: mainCat.image || "/placeholder.svg"
            }
          })

          // Limit to 9 categories for 3x3 grid, or show all if less than 9
          setCategories(categoriesWithCounts.slice(0, 9))
        }
      } catch (error) {
        console.error('Error fetching main categories:', error)
        // Fallback to product-based categories if API fails
        if (products.length > 0) {
          const categoryMap = new Map<string, { count: number, image: string }>()

          products.forEach((product) => {
            if (product.category) {
              const categoryName = product.category
              if (!categoryMap.has(categoryName)) {
                const categoryProduct = products.find(p => p.category === categoryName)
                const categoryImage = categoryProduct?.images && categoryProduct.images.length > 0
                  ? categoryProduct.images[0].url
                  : "/placeholder.svg"

                categoryMap.set(categoryName, {
                  count: 1,
                  image: categoryImage
                })
              } else {
                const existing = categoryMap.get(categoryName)!
                categoryMap.set(categoryName, {
                  ...existing,
                  count: existing.count + 1
                })
              }
            }
          })

          const categoriesArray = Array.from(categoryMap.entries()).map(([name, data], index) => ({
            id: `category-${index}`,
            name,
            count: data.count,
            image: data.image
          }))

          setCategories(categoriesArray.slice(0, 9))
        }
      }
    }

    fetchMainCategories()
  }, [products])

  const handleCardClick = async (e: React.MouseEvent, categoryName: string, categoryId: string) => {
    e.preventDefault()
    setActiveCard(categoryName)

    // Auto-scroll to top after animation completes
    setTimeout(async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setSelectedCategory(categoryName)
      setSelectedMainCategoryId(categoryId)

      // Fetch subcategories for this main category
      try {
        const response = await fetch(`/api/categories/sub?mainCategory=${encodeURIComponent(categoryName)}`)
        const data = await response.json()

        if (data.success && data.subCategories && data.subCategories.length > 0) {
          // Count products per subcategory
          const subCategoriesWithCounts = data.subCategories.map((subCat: any) => {
            const count = products.filter(p =>
              p.subCategory === subCat.name ||
              p.category === subCat.name
            ).length

            return {
              id: subCat._id,
              name: subCat.name,
              count: count,
              image: subCat.image || "/placeholder.svg",
              mainCategory: subCat.mainCategory
            }
          })

          setSubCategories(subCategoriesWithCounts)
          setIsViewingSubCategories(true)
        } else {
          // No subcategories, show products directly
          setSubCategories([])
          setIsViewingSubCategories(false)
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error)
        // On error, show products directly
        setSubCategories([])
        setIsViewingSubCategories(false)
      }
    }, 900)
  }

  const handleSubCategoryClick = (e: React.MouseEvent, subCategoryName: string) => {
    e.preventDefault()
    setActiveCard(subCategoryName)

    // Auto-scroll to top after animation completes
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setSelectedCategory(subCategoryName)
      setIsViewingSubCategories(false)
    }, 900)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedMainCategoryId(null)
    setActiveCard(null)
    setHoveredCard(null)
    setSubCategories([])
    setIsViewingSubCategories(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToSubCategories = () => {
    setIsViewingSubCategories(true)
    setSelectedCategory(null)
  }

  // Filter products by selected category
  const getFilteredProducts = () => {
    if (!selectedCategory) return []

    return products.filter(product => {
      const productCategory = product.category?.toLowerCase() || ''
      const productSubCategory = product.subCategory?.toLowerCase() || ''
      const selected = selectedCategory.toLowerCase()

      // Match exact category/subcategory or if category contains the selected category name
      return productCategory === selected ||
        productSubCategory === selected ||
        productCategory.includes(selected) ||
        productSubCategory.includes(selected) ||
        selected.includes(productCategory) ||
        selected.includes(productSubCategory)
    })
  }

  const filteredProducts = getFilteredProducts()

  // Show categories grid if no category is selected
  if (!selectedCategory && !isViewingSubCategories) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Top spacing to prevent navbar overlap */}
        <div className="h-20"></div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Page Title */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4">
              Shop by Category
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
              Explore our curated collections of product variety, elegant hijabs, and stylish leather bags
            </p>
          </div>

          {/* Categories Grid - 3 columns on desktop */}
          {categories.length === 0 && !loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">No categories available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
              {categories.map((category, index) => {
                const isHovered = hoveredCard === category.name
                const isActive = activeCard === category.name

                return (
                  <article
                    key={category.id}
                    className="group collection-card-wrapper relative aspect-[4/3.5] overflow-visible rounded-lg shadow-lg transition-transform duration-500 hover:-translate-y-1 cursor-pointer"
                    onMouseEnter={() => setHoveredCard(category.name)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={(e) => handleCardClick(e, category.name, category.id)}
                  >
                    {/* Main Container */}
                    <div className="block h-full w-full relative">
                      {/* Image Container */}
                      <div className="relative h-full w-full rounded-lg overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading={index < 3 ? "eager" : "lazy"}
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />

                        {/* Text Overlay - Bottom Positioned */}
                        <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-10">
                          <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white uppercase tracking-wide">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Animated Border System */}

                      {/* Bottom Border - Expands from center */}
                      <div
                        className="absolute bottom-0 left-1/2 h-0.5"
                        style={{
                          backgroundColor: '#510c74',
                          transform: 'translateX(-50%)',
                          width: isActive || isHovered ? '100%' : '0%',
                          transition: isHovered
                            ? 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                            : 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.6s'
                        }}
                      />

                      {/* Left Border - Extends upward */}
                      <div
                        className="absolute bottom-0 left-0 w-0.5"
                        style={{
                          backgroundColor: '#510c74',
                          height: isActive || isHovered ? '100%' : '0%',
                          transition: 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                        }}
                      />

                      {/* Right Border - Extends upward */}
                      <div
                        className="absolute bottom-0 right-0 w-0.5"
                        style={{
                          backgroundColor: '#510c74',
                          height: isActive || isHovered ? '100%' : '0%',
                          transition: 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                        }}
                      />

                      {/* Top Border - Expands from center (only on click) */}
                      <div
                        className="absolute top-0 left-1/2 h-0.5"
                        style={{
                          backgroundColor: '#510c74',
                          transform: 'translateX(-50%)',
                          width: isActive ? '100%' : '0%',
                          transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                        }}
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show subcategories if viewing subcategories
  if (isViewingSubCategories && subCategories.length > 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Top spacing to prevent navbar overlap */}
        <div className="h-20"></div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Back Button and Category Title */}
          <div className="mb-8 sm:mb-12 flex items-center gap-4">
            <Button
              onClick={handleBackToCategories}
              variant="outline"
              className="flex items-center gap-2"
              style={{
                borderColor: '#510c74',
                color: '#510c74'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
              {selectedCategory} - Subcategories
            </h1>
          </div>

          {/* Subcategories Grid - Same layout as main categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {subCategories.map((subCategory, index) => {
              const isHovered = hoveredCard === subCategory.name
              const isActive = activeCard === subCategory.name

              return (
                <article
                  key={subCategory.id}
                  className="group collection-card-wrapper relative aspect-[4/3.5] overflow-visible rounded-lg shadow-lg transition-transform duration-500 hover:-translate-y-1 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(subCategory.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => handleSubCategoryClick(e, subCategory.name)}
                >
                  {/* Main Container */}
                  <div className="block h-full w-full relative">
                    {/* Image Container */}
                    <div className="relative h-full w-full rounded-lg overflow-hidden">
                      <Image
                        src={subCategory.image || "/placeholder.svg"}
                        alt={subCategory.name}
                        fill
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading={index < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />

                      {/* Text Overlay - Bottom Positioned */}
                      <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-10">
                        <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white uppercase tracking-wide">
                          {subCategory.name}
                        </h3>
                      </div>
                    </div>

                    {/* Animated Border System - Same as main categories */}
                    {/* Bottom Border - Expands from center */}
                    <div
                      className="absolute bottom-0 left-1/2 h-0.5"
                      style={{
                        backgroundColor: '#510c74',
                        transform: 'translateX(-50%)',
                        width: isActive || isHovered ? '100%' : '0%',
                        transition: isHovered
                          ? 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                          : 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.6s'
                      }}
                    />

                    {/* Left Border - Extends upward */}
                    <div
                      className="absolute bottom-0 left-0 w-0.5"
                      style={{
                        backgroundColor: '#510c74',
                        height: isActive || isHovered ? '100%' : '0%',
                        transition: 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                      }}
                    />

                    {/* Right Border - Extends upward */}
                    <div
                      className="absolute bottom-0 right-0 w-0.5"
                      style={{
                        backgroundColor: '#510c74',
                        height: isActive || isHovered ? '100%' : '0%',
                        transition: 'height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
                      }}
                    />

                    {/* Top Border - Expands from center (only on click) */}
                    <div
                      className="absolute top-0 left-1/2 h-0.5"
                      style={{
                        backgroundColor: '#510c74',
                        transform: 'translateX(-50%)',
                        width: isActive ? '100%' : '0%',
                        transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s'
                      }}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Show products for selected category
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Back Button and Category Title */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            onClick={isViewingSubCategories ? handleBackToSubCategories : handleBackToCategories}
            variant="outline"
            className="flex items-center gap-2"
            style={{
              borderColor: '#510c74',
              color: '#510c74'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isViewingSubCategories ? 'Back to Subcategories' : 'Back to Categories'}
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
            {selectedCategory}
          </h1>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#510c74] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No products found in {selectedCategory} category.
            </p>
            <Button
              onClick={handleBackToCategories}
              style={{
                backgroundColor: '#510c74',
                color: '#fff'
              }}
            >
              Back to Categories
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <Link
                    href={product.isOutOfStock ? "#" : `/view-details?id=${product._id}`}
                    className={`block ${product.isOutOfStock ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-white/90 text-[#510c74] px-4 py-2 rounded-full font-bold shadow-lg transform -rotate-12 border-2 border-[#510c74]">
                          OUT OF STOCK
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && !product.isOutOfStock && (
                      <span className="bg-[#fff4df] text-[#510c74] border border-[#510c74]/20 px-3 py-1 text-xs font-bold rounded-full">NEW</span>
                    )}
                    {product.isOnSale && !product.isOutOfStock && (
                      <span className="bg-[#510c74] text-white px-3 py-1 text-xs font-bold rounded-full">SALE</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  {!product.isOutOfStock && (
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#510c74] hover:text-white transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <Link href={`/view-details?id=${product._id}`}>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#510c74] hover:text-white transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews || 0})</span>
                  </div>

                  <Link href={product.isOutOfStock ? "#" : `/view-details?id=${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#510c74] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-3">MARIYAE KALIN</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold" style={{ color: '#510c74' }}>
                        ₹{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                      {product.isOnSale && product.offerPercentage && !product.isOutOfStock && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {product.offerPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      className={`flex-1 ${product.isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#510c74] hover:bg-[#240334]'} text-white`}
                      disabled={product.isOutOfStock}
                      onClick={() => !product.isOutOfStock && addItem({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice || undefined,
                        image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                        category: product.category,
                        brand: "MARIYAE KALIN"
                      })}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
