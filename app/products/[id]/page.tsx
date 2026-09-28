"use client"

import Navbar from "@/components/navbar"
import ProductDetail from "@/components/product-detail"
import RelatedProducts from "@/components/related-products"
import Footer from "@/components/footer"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      <ProductDetail productId={params.id} />
      <RelatedProducts />
      <Footer />
    </div>
  )
}
