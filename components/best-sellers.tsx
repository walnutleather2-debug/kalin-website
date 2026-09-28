import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/wishlist-context"
import { useProducts } from "@/hooks/useProducts"

export default function BestSellers() {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { products, loading } = useProducts()

  // Select top products as best sellers (e.g., those with most reviews or just top 4)
  const bestSellers = products
    .filter(p => p.isActive)
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 4)

  if (loading || bestSellers.length === 0) {
    return null // or a skeleton
  }

  return (
    <section className="py-16 bg-[#510c74]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-white mb-4 animate-fade-in-up">Best Sellers</h2>
          <p className="text-white opacity-90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Our most loved pieces, chosen by customers worldwide for their exceptional quality and timeless beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product, index) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Best seller badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#510c74] text-[#fff4df] px-4 py-1.5 text-xs font-bold rounded-full shadow-lg border border-[#fff4df]/20">
                    BEST SELLER
                  </span>
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isInWishlist(product._id)
                      ? "bg-[#510c74] text-white"
                      : "bg-white text-gray-900 hover:bg-[#510c74] hover:text-white"
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
                  </button>
                  <Link href={`/view-details?id=${product._id}`}>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#510c74] hover:text-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-[#510c74]">
                  <span>{product.category}</span>
                  <div className="flex items-center bg-[#fff4df] px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                    <span className="text-gray-900">{product.rating}</span>
                  </div>
                </div>

                <Link href={`/view-details?id=${product._id}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-[#510c74] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-[#510c74]">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <Link href={`/view-details?id=${product._id}`}>
                    <Button variant="outline" size="sm" className="border-[#510c74] text-[#510c74] hover:bg-[#510c74] hover:text-white rounded-lg">
                      Details
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
