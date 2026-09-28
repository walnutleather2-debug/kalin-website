import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { useWishlist } from "@/contexts/wishlist-context"

export default function FeaturedProducts() {
  const { products, loading } = useProducts()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Get first 4 products for featured section
  const featuredProducts = products.slice(0, 4)

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of product varieties, crafted with precision and designed to make
              you shine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No featured products yet. Add some products from the dashboard!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of product varieties, crafted with precision and designed to make
            you shine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
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
                    <span className="bg-[#fff4df] text-[#510c74] border border-[#510c74]/20 px-3 py-1 text-xs font-bold rounded-full text-center">NEW</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-[#510c74] text-white px-3 py-1 text-xs font-bold rounded-full text-center">SALE</span>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#510c74] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-3">JEWELS BY LAHARI</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#510c74]">₹{product.price}</span>
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

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link href={`/view-details?id=${product._id}`} className="flex-1">
                    <Button className="w-full bg-[#510c74] hover:bg-[#240334] text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
