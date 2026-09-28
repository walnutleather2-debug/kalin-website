"use client"

import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import RelatedProducts from "@/components/related-products"
import Footer from "@/components/footer"

export default function ViewDetailsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      <ProductDetail />
      <RelatedProducts />
      <Footer />
    </div>
  )
}
