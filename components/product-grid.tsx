import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/useProducts"
import { useWishlist } from "@/contexts/wishlist-context"

export default function ProductGrid() {
  const { addItem } = useCart()
  const { products, loading, error } = useProducts()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-64"></div>
            <div className="p-6 space-y-3">
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading products: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products found. Add some products from the dashboard!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
          <div className="relative overflow-hidden">
            <Image
              src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.isNew && (
                <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">NEW</span>
              )}
              {product.isOnSale && (
                <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full">SALE</span>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
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
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${isInWishlist(product._id)
                  ? "bg-[#510c74] text-white"
                  : "bg-white text-gray-900 hover:bg-[#510c74] hover:text-white"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
              </button>
              <Link href={`/view-details?id=${product._id}`}>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#510c74] hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>

            <div className="flex items-center mb-2">
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

            <Link href={`/view-details?id=${product._id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#C4A484] transition-colors">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 mb-3">JEWELS BY LAHARI</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-[#C4A484]">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.isOnSale && product.offerPercentage && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {product.offerPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons - Horizontal Layout Below Price */}
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => addItem({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice || undefined,
                  image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
                  category: product.category,
                  brand: "JEWELS BY LAHARI"
                })}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
