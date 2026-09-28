"use client"

import { CheckCircle, Package, Truck, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CheckoutSuccessPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#fff4df] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-[#510c74]" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">We're preparing your order</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#510c74]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-[#510c74]" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping</h3>
                <p className="text-sm text-gray-600">Estimated 3-5 business days</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#510c74]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#510c74]" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery</h3>
                <p className="text-sm text-gray-600">Track your package</p>
              </div>
            </div>

            <div className="bg-[#fff4df] rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">What's Next?</h3>
              <div className="text-left space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-[#510c74] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                  <p>You'll receive an order confirmation email with your order details and tracking information.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-[#510c74] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                  <p>Our team will process your order and prepare it for shipping within 24-48 hours.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-[#510c74] text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                  <p>You'll receive shipping updates and can track your package until it reaches your doorstep.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-[#510c74] hover:bg-[#240334] text-white">
                  <Home className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-[#510c74] text-[#510c74] hover:bg-[#fff4df]">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse More Products
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Need help? <Link href="/contact" className="text-[#510c74] hover:text-[#240334]">Contact our support team</Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 Email: support@mariyae.com</p>
                <p>📞 Phone: +91 7045932672</p>
                <p>🕒 Hours: Mon-Sat 9AM-8PM IST</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Return Policy</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✅ 7-day return window</p>
                <p>✅ Quality assured returns</p>
                <p>✅ Full refund or exchange</p>
                <p>✅ Original packaging required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
