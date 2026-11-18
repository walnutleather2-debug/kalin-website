"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Truck, ShieldCheck, Lock, CheckCircle, MapPin, CreditCard, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useOrders, CreateOrderData } from "@/hooks/useOrders"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

declare global {
  interface Window {
    Razorpay: any
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { state, clearCart, addItem, updateQuantity } = useCart()
  const { createOrder } = useOrders()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'razorpay'
  })

  // Optional: Auto-fill saved delivery address from local browser storage if previously entered (for guest convenience)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bhadohi_checkout_address')
      if (saved) {
        const parsed = JSON.parse(saved)
        setFormData(prev => ({
          ...prev,
          ...parsed,
          paymentMethod: prev.paymentMethod || 'razorpay'
        }))
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [])

  // Handle direct product purchase from "Buy Now" button
  useEffect(() => {
    const productId = searchParams.get('product')
    const quantity = parseInt(searchParams.get('quantity') || '1')

    if (productId && state.items.length === 0) {
      const fetchAndAddProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`)
          const data = await response.json()

          if (data.success && data.data) {
            const product = data.data
            addItem({
              id: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
              category: product.category,
              brand: "BHADOHI KALEEN"
            })

            if (quantity > 1) {
              setTimeout(() => {
                updateQuantity(product._id, quantity)
              }, 100)
            }
          }
        } catch (error) {
          console.error('Failed to fetch product:', error)
          router.push('/cart')
        }
      }

      fetchAndAddProduct()
    }
  }, [searchParams, state.items.length, addItem, router, updateQuantity])

  // Handle empty cart redirect on client side
  useEffect(() => {
    if (state.items.length === 0 && !searchParams.get('product')) {
      router.push('/cart')
    }
  }, [state.items.length, router, searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  // Validate all fields before placing order
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number"
    }

    if (!formData.address.trim()) newErrors.address = "Street address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "PIN Code is required"
    } else if (formData.zipCode.replace(/\D/g, '').length < 5) {
      newErrors.zipCode = "Please enter a valid PIN code"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]
      toast({
        title: "Please Complete All Details",
        description: firstError,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isProcessing) return

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Save details to localStorage for future convenience (pure client guest storage)
    try {
      localStorage.setItem('bhadohi_checkout_address', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }))
    } catch {
      // Ignore
    }

    try {
      const orderTotal = Math.round((state.total + (state.total * 0.18)) * 100) / 100

      // Base order data structure (guest checkout, no login required)
      const baseOrderData: CreateOrderData = {
        customerDetails: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country
        },
        items: state.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        subtotal: state.total,
        tax: state.total * 0.18,
        total: orderTotal,
        paymentMethod: formData.paymentMethod as any
      }

      // 1. CASH ON DELIVERY FLOW
      if (formData.paymentMethod === 'cod') {
        const order = await createOrder({
          ...baseOrderData,
          paymentMethod: 'cod',
          paymentStatus: 'pending'
        })
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${order.orderNumber} confirmed with Cash on Delivery.`,
        })
        clearCart()
        router.push('/checkout/success')
        return
      }

      // 2. RAZORPAY PAYMENT GATEWAY FLOW
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast({
          title: "Payment Gateway Error",
          description: "Razorpay SDK could not load. Please check your internet connection.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }

      // A. Create Razorpay order on backend
      const orderRes = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderTotal,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone
          }
        })
      })

      const orderData = await orderRes.json()

      if (!orderData.success) {
        toast({
          title: "Payment Initialization Failed",
          description: orderData.error || "Could not initialize payment gateway. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }

      // B. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Bhadohi Kaleen",
        description: `Order Payment (${state.itemCount} ${state.itemCount === 1 ? 'item' : 'items'})`,
        image: "/bha-kaleen2-removebg-preview.png",
        order_id: orderData.orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}`,
        },
        theme: {
          color: "#510c74",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You closed the Razorpay payment window.",
            })
          }
        },
        handler: async function (response: any) {
          try {
            // C. Verify signature on backend and confirm order
            const verifyRes = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  ...baseOrderData,
                  paymentMethod: 'razorpay',
                  paymentStatus: 'paid'
                }
              })
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: `Payment confirmed (ID: ${response.razorpay_payment_id}). Order confirmed!`,
              })
              clearCart()
              router.push('/checkout/success')
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyData.error || "Payment verification failed. Please contact our support.",
                variant: "destructive"
              })
            }
          } catch (err: any) {
            console.error('Verification error:', err)
            toast({
              title: "Verification Error",
              description: "Failed to verify payment status. Please contact support.",
              variant: "destructive"
            })
          } finally {
            setIsProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error)
        toast({
          title: "Payment Declined",
          description: resp.error?.description || "Payment failed or was declined by bank. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
      })
      rzp.open()

    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Error Placing Order",
        description: "There was an unexpected error processing your order. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const taxAmount = state.total * 0.18
  const total = state.total + taxAmount

  // Show loading state while checking cart
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#510c74] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>

      <main className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/cart" className="inline-flex items-center text-sm font-medium text-[#510c74] hover:text-[#240334] mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Cart
              </Link>
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">Direct Checkout</h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your delivery details below to place your order directly. No login or password required.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-gray-800">256-Bit SSL Encrypted & PCI-DSS Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details & Payment Method (8 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Step 1: Customer Contact & Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-7">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#510c74] text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                    <p className="text-xs text-gray-500">Where should we deliver your handcrafted carpet?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="e.g. Ramesh"
                      className={`mt-1 ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="e.g. Sharma"
                      className={`mt-1 ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ramesh@example.com"
                      className={`mt-1 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">Order confirmation & tracking sent here</p>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`mt-1 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">Used for delivery agent updates & SMS</p>
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                      Street Address / House / Flat <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Flat / House No., Apartment name, Street, Landmark"
                      className={`mt-1 ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city" className="text-xs font-semibold text-gray-700">
                      City / Town <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Mumbai, Varanasi, Delhi"
                      className={`mt-1 ${errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state" className="text-xs font-semibold text-gray-700">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="e.g. Maharashtra, Uttar Pradesh"
                      className={`mt-1 ${errors.state ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.state && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.state}
                      </p>
                    )}
                  </div>

                  {/* ZIP / PIN Code */}
                  <div>
                    <Label htmlFor="zipCode" className="text-xs font-semibold text-gray-700">
                      PIN Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="e.g. 410210"
                      className={`mt-1 ${errors.zipCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.zipCode && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.zipCode}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="country" className="text-xs font-semibold text-gray-700">
                      Country
                    </Label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#510c74] focus:ring-offset-2"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="UAE">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-7">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#510c74] text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    <p className="text-xs text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Razorpay Option */}
                  <label
                    htmlFor="payment-razorpay"
                    className={`block border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-[#510c74] bg-[#fff4df]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          id="payment-razorpay"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === 'razorpay'}
                          onChange={() => handleInputChange('paymentMethod', 'razorpay')}
                          className="text-[#510c74] mt-1 accent-[#510c74] w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900 text-base">
                              Razorpay Secure Payment
                            </span>
                            <span className="bg-[#510c74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            Pay instantly and safely using any UPI app, Debit/Credit Card, NetBanking, or Digital Wallet.
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] text-gray-700 font-medium">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded shadow-2xs">⚡ UPI (GPay, PhonePe, Paytm)</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded shadow-2xs">💳 Visa / MasterCard / RuPay</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded shadow-2xs">🏦 50+ Banks</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded shadow-2xs">📱 Wallets</span>
                          </div>
                        </div>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-[#510c74] flex-shrink-0" />
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    htmlFor="payment-cod"
                    className={`block border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#510c74] bg-[#fff4df]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="payment-cod"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => handleInputChange('paymentMethod', 'cod')}
                        className="text-[#510c74] mt-1 accent-[#510c74] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 text-base">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay in cash or UPI directly to our delivery executive when your package reaches your doorstep.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Main Submit Button (Visible on all devices) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isProcessing}
                  className="w-full bg-[#510c74] hover:bg-[#240334] text-white py-6 text-base font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-5 h-5" />
                  {isProcessing ? (
                    'Processing Order...'
                  ) : formData.paymentMethod === 'razorpay' ? (
                    `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with Razorpay Secure`
                  ) : (
                    `Confirm Order with Cash on Delivery (₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                  )}
                </Button>

                <p className="text-[12px] text-gray-500 text-center mt-3 leading-relaxed">
                  By clicking place order, you agree to Bhadohi Kaleen's{' '}
                  <Link href="/terms-and-conditions" className="text-[#510c74] underline hover:text-[#240334]">
                    Terms & Conditions
                  </Link>
                  ,{' '}
                  <Link href="/privacy-policy" className="text-[#510c74] underline hover:text-[#240334]">
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link href="/return-policy" className="text-[#510c74] underline hover:text-[#240334]">
                    Return Policy
                  </Link>
                  .
                </p>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-normal text-gray-500">
                    {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                {/* Items preview list */}
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto my-4 pr-1">
                  {state.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-[#510c74] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-tl">
                          ×{item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        {item.category && (
                          <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 text-right">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{state.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 items-center">
                    <span>Shipping & Delivery</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Applicable GST (18%)</span>
                    <span className="font-medium text-gray-900">
                      ₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-gray-900">Total Amount</span>
                      <p className="text-[11px] text-gray-400">Includes all taxes & doorstep delivery</p>
                    </div>
                    <span className="text-2xl font-bold text-[#510c74]">
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Trust and Delivery Guarantees */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#510c74] flex-shrink-0" />
                    <span>Free insured doorstep delivery across India</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#510c74] flex-shrink-0" />
                    <span className="font-medium text-gray-900">100% Secure payment via Razorpay</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#510c74] flex-shrink-0" />
                    <span>7-day hassle-free returns & replacement</span>
                  </div>
                </div>

                {/* Customer Support Info */}
                <div className="mt-6 p-3 bg-[#fff4df]/60 rounded-lg text-center border border-[#510c74]/10">
                  <p className="text-[12px] text-gray-700 font-medium">Need help with your order?</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Call: <a href="tel:+917045932672" className="text-[#510c74] font-semibold hover:underline">+91 7045932672</a> • Email: <a href="mailto:contact@bhadohikaleen.com" className="text-[#510c74] font-semibold hover:underline">contact@bhadohikaleen.com</a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
