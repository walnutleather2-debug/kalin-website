"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Star, Plus, Minus, Share2, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  description: string
  keyFeatures: string[]
  images: Array<{ url: string; publicId: string }>
  videos: Array<{ url: string; publicId: string }>
  category: string
  quantity: number
  isNew: boolean
  isOnSale: boolean
  isOutOfStock: boolean
  offerPercentage?: number
  sizeConstraints?: string
}

export default function ProductDetail() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        // Get product ID from URL params or use a default
        const productId = searchParams.get('id') || searchParams.get('productId')

        if (productId) {
          // Fetch specific product by ID
          const response = await fetch(`/api/products/${productId}`)
          const data = await response.json()

          if (data.success) {
            setProduct(data.data)
          } else {
            setError(data.error || 'Failed to fetch product')
          }
        } else {
          // If no product ID, fetch the first available product or show a message
          const response = await fetch('/api/products')
          const data = await response.json()

          if (data.success && data.data.length > 0) {
            setProduct(data.data[0]) // Show first product as default
          } else {
            setError('No products available')
          }
        }
      } catch (err) {
        setError('Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [searchParams])

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      category: product.category,
      brand: "MARIYAE KALIN"
    })
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images && product.images.length > 0 ? product.images[selectedImage].url : "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-[#510c74]" : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">{product.name}</h1>
              {product.isOutOfStock && (
                <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold mb-4">
                  CURRENTLY OUT OF STOCK
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-[#510c74]">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
                {product.isOnSale && product.offerPercentage && (
                  <span className="bg-[#510c74] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.offerPercentage}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#510c74] rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Selection */}
              {product.sizeConstraints && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizeConstraints.split(',').map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size.trim())}
                        className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size.trim()
                          ? "border-[#510c74] bg-[#510c74] text-white"
                          : "border-gray-300 hover:border-[#510c74]"
                          }`}
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.quantity}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-600">({product.quantity} available)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.isOutOfStock}
                  className={`flex-1 ${product.isOutOfStock ? 'bg-gray-400' : 'bg-[#510c74] hover:bg-[#240334]'} text-white py-3 text-lg`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </Button>
                {!product.isOutOfStock ? (
                  <Link href={`/checkout?product=${product._id}&quantity=${quantity}`}>
                    <Button className="flex-1 bg-[#fff4df] hover:bg-[#ffedc2] text-[#510c74] py-3 text-lg border border-[#510c74]/20">
                      Buy Now
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="flex-1 bg-gray-100 text-gray-400 py-3 text-lg border border-gray-200">
                    Currently Unavailable
                  </Button>
                )}
                <Button
                  variant="outline"
                  className={`px-6 py-3 transition-colors ${isInWishlist(product._id) ? "bg-[#510c74] text-white" : ""}`}
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id)
                    } else {
                      addToWishlist({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                        category: product.category
                      })
                    }
                  }}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/return-policy" className="flex items-center text-[#510c74] hover:underline font-medium">
                    <RotateCcw className="w-5 h-5 mr-3" />
                    <span>7 Day Return Policy (View Details)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
