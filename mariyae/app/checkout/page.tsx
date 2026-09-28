"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, User, Lock, Mail, Smartphone, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
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
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
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

  // Optional user ID for orders
  const [userId, setUserId] = useState<string | undefined>(undefined)

  // Auto-fill customer details if previously saved in browser
  useEffect(() => {
    const checkSavedCustomer = async () => {
      try {
        const storedUser = localStorage.getItem('mariyae_user_data')
        const authStatus = localStorage.getItem('mariyae_user_auth')

        if (authStatus === 'true' && storedUser) {
          const userData = JSON.parse(storedUser)
          setUserId(userData._id)
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            email: userData.email || prev.email
          }))
          return
        }

        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUserId(userData.data?._id || userData._id)
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            email: userData.email || prev.email
          }))
        }
      } catch (error) {
        // Direct checkout - no login required
      }
    }

    checkSavedCustomer()
  }, [])

  // Handle direct product purchase from Buy Now button
  useEffect(() => {
    const productId = searchParams.get('product')
    const quantity = parseInt(searchParams.get('quantity') || '1')

    if (productId && state.items.length === 0) {
      // Fetch product details and add to cart
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
              brand: "JEWELS BY LAHARI"
            })

            // Set the quantity if it's not 1
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
  }, [searchParams, state.items.length, addItem, router])

  // Handle empty cart redirect on client side
  useEffect(() => {
    if (state.items.length === 0 && !searchParams.get('product')) {
      router.push('/cart')
    }
  }, [state.items.length, router, searchParams])



  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData)
  }, [formData])

  // Show loading state while checking cart
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#510c74] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1) {
        const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
        const missingFields = step1Fields.filter(field => !formData[field as keyof typeof formData])

        if (missingFields.length > 0) {
          toast({
            title: "Missing Information",
            description: `Please fill in: ${missingFields.join(', ')}`,
            variant: "destructive",
          })
          return
        }
      }

      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Validate form data
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      setIsProcessing(false)
      return
    }

    try {
      const orderTotal = Math.round((state.total + (state.total * 0.18)) * 100) / 100

      // Base order data structure
      const baseOrderData: CreateOrderData = {
        userId: userId,
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
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

      if (formData.paymentMethod === 'cod') {
        // Direct COD order creation
        const order = await createOrder({
          ...baseOrderData,
          paymentMethod: 'cod',
          paymentStatus: 'pending'
        })
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${order.orderNumber} has been created (Cash on Delivery).`,
        })
        clearCart()
        router.push('/checkout/success')
        return
      }

      // Razorpay Payment Flow
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast({
          title: "Payment Gateway Error",
          description: "Razorpay SDK failed to load. Please check your internet connection.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }

      // 1. Create Razorpay order on server
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
          title: "Payment Configuration Note",
          description: orderData.error || "Could not initialize payment. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Mariyae Kalin",
        description: `Order Payment (${state.itemCount} items)`,
        image: "/mariyae_dark_wbg.png",
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
            // 3. Verify payment signature on backend & save confirmed order
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
                description: `Payment ID: ${response.razorpay_payment_id}. Order confirmed!`,
              })
              clearCart()
              router.push('/checkout/success')
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyData.error || "Payment verification failed. Please contact support.",
                variant: "destructive"
              })
            }
          } catch (err: any) {
            console.error('Verification error:', err)
            toast({
              title: "Verification Error",
              description: "Failed to confirm payment status. Please contact support.",
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
          title: "Payment Failed",
          description: resp.error?.description || "Payment was declined or failed. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
      })
      rzp.open()

    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Error Placing Order",
        description: "There was an error initiating your order. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const total = state.total + (state.total * 0.18) // Including tax



  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center text-[#510c74] hover:text-[#240334] mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-4xl font-light text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step
                    ? 'bg-[#510c74] border-[#510c74] text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                    {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-2 ${currentStep > step ? 'bg-[#510c74]' : 'bg-gray-300'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-16">
              <span className={`text-sm ${currentStep >= 1 ? 'text-[#510c74] font-medium' : 'text-gray-500'}`}>
                Shipping
              </span>
              <span className={`text-sm ${currentStep >= 2 ? 'text-[#510c74] font-medium' : 'text-gray-500'}`}>
                Payment
              </span>
              <span className={`text-sm ${currentStep >= 3 ? 'text-[#510c74] font-medium' : 'text-gray-500'}`}>
                Review
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {currentStep === 1 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">Contact & Delivery Information</h2>
                      <p className="text-sm text-gray-500 mt-1">Direct Checkout — No account registration or password required.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 7045932672"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="400001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#510c74] focus:ring-offset-2"
                          required
                        >
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      {/* Razorpay Option */}
                      <div
                        onClick={() => handleInputChange('paymentMethod', 'razorpay')}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                          formData.paymentMethod === 'razorpay'
                            ? 'border-[#510c74] bg-[#fff4df]/40 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              id="razorpay"
                              name="paymentMethod"
                              value="razorpay"
                              checked={formData.paymentMethod === 'razorpay'}
                              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                              className="text-[#510c74] mt-1"
                            />
                            <div>
                              <Label htmlFor="razorpay" className="font-semibold text-gray-900 text-base cursor-pointer flex items-center gap-2">
                                <span>Razorpay Secure Payment</span>
                                <span className="bg-[#510c74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Recommended
                                </span>
                              </Label>
                              <p className="text-xs text-gray-600 mt-1">
                                Pay securely using UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking, or Wallets.
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-700">
                                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded font-medium shadow-2xs">⚡ Instant UPI</span>
                                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded font-medium shadow-2xs">💳 Visa / MasterCard / RuPay</span>
                                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded font-medium shadow-2xs">🏦 50+ Banks</span>
                                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded font-medium shadow-2xs">📱 Digital Wallets</span>
                              </div>
                            </div>
                          </div>
                          <ShieldCheck className="w-6 h-6 text-[#510c74] flex-shrink-0" />
                        </div>
                      </div>

                      {/* Cash on Delivery Option */}
                      <div
                        onClick={() => handleInputChange('paymentMethod', 'cod')}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                          formData.paymentMethod === 'cod'
                            ? 'border-[#510c74] bg-[#fff4df]/40 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="text-[#510c74] mt-1"
                          />
                          <div>
                            <Label htmlFor="cod" className="font-semibold text-gray-900 text-base cursor-pointer">
                              Cash on Delivery (COD)
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              Pay in cash upon doorstep delivery.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Review</h2>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                        <p className="text-gray-600">
                          {formData.firstName} {formData.lastName}<br />
                          {formData.address}<br />
                          {formData.city}, {formData.state} {formData.zipCode}<br />
                          {formData.country}
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                        <p className="text-gray-600 font-medium">
                          {formData.paymentMethod === 'razorpay'
                            ? 'Razorpay Secure (Cards, UPI, Netbanking, Wallets)'
                            : 'Cash on Delivery (COD)'}
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                        <div className="space-y-2">
                          {state.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevStep} className="border-[#510c74] text-[#510c74] hover:bg-[#fff4df]">
                      Previous
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep} className="ml-auto bg-[#510c74] hover:bg-[#240334] text-white">
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="ml-auto bg-[#510c74] hover:bg-[#240334] text-white px-8 py-3 text-base font-semibold flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {isProcessing
                        ? 'Processing...'
                        : formData.paymentMethod === 'razorpay'
                        ? `Pay with Razorpay (₹${total.toFixed(2)})`
                        : 'Confirm Order (Cash on Delivery)'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                    <span className="font-medium">₹{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium">₹{(state.total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#510c74]" />
                    <span className="select-none">Free standard delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#510c74]" />
                    <span className="select-none font-medium text-gray-900">100% Secure via Razorpay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#510c74]" />
                    <span className="select-none">7-day hassle-free return</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 bg-[#fff4df]/50 rounded-lg p-3 text-center">
                  <p className="text-[11px] text-gray-600 leading-tight">
                    🔒 Protected by Razorpay 256-bit SSL encryption. Accepts UPI, Credit/Debit cards & NetBanking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
