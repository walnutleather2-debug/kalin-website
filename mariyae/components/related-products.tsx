"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export default function RelatedProducts() {
  const { products } = useProducts()
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Get 4 random products (excluding the current one)
  const relatedProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">You Might Also Like</h2>
          <p className="text-gray-600">Discover more beautiful pieces from our collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
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
                </div>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                </div>
              </div>

              <div className="p-6">
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#510c74]">₹{product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
