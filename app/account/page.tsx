"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  LogOut,
  Eye,
  FileText
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/hooks/useOrders"
import { useWishlist } from "@/contexts/wishlist-context"
import { Heart, Trash2, ShoppingCart as ShoppingCartIcon } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import InvoiceModal from "@/components/InvoiceModal"

export default function AccountPage() {
  const router = useRouter()
  const { getUserOrders, loading: ordersLoading } = useOrders()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  })

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('mariyae_user_data')
        const authStatus = localStorage.getItem('mariyae_user_auth')

        if (authStatus === 'true' && storedUser) {
          const userData = JSON.parse(storedUser)
          setIsAuthenticated(true)
          setUser(userData)
          setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address?.street || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            zipCode: userData.address?.zipCode || ""
          })

          // Fetch user orders if we have an ID or email
          if (userData._id || userData.email) {
            await fetchUserOrders(userData._id || "", userData.email)
          }
        } else {
          // If not authenticated, we stay on the page but show the login required card
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch user orders
  const fetchUserOrders = async (userId: string, email?: string) => {
    try {
      const userOrders = await getUserOrders(userId, email)
      setOrders(userOrders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      })
    }
  }

  const handleViewInvoice = (order: any) => {
    setSelectedInvoiceOrder(order)
    setShowInvoiceModal(true)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('mariyae_user_auth')
      localStorage.removeItem('mariyae_user_data')

      setIsAuthenticated(false)
      setUser(null)
      router.push('/')
      router.refresh()

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        })
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20"></div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#510c74] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20"></div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
          <Card className="w-full max-w-md border-[#510c74]/20 shadow-xl overflow-hidden">
            <div className="h-2 w-full bg-[#510c74]" />
            <CardHeader className="text-center pt-8">
              <div className="w-16 h-16 bg-[#510c74]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#510c74]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Login Required</CardTitle>
              <CardDescription>Please log in to view your orders, wishlist, and profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <Button
                onClick={() => {
                  // Trigger login modal via some event or just link to home where it can be opened
                  // For now, let's just go home and the user can click Login
                  router.push('/')
                  toast({
                    title: "Please Login",
                    description: "Click the User icon in the navigation bar to login.",
                  })
                }}
                className="w-full bg-[#510c74] hover:bg-[#240334] text-white py-6 text-lg"
              >
                Sign In / Register
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/shop')}
                className="w-full border-gray-200"
              >
                Explore Collection
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <Package className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      <div className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900">Welcome, {user?.firstName}</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Manage your profile, orders, and preferences</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <User className="w-3 h-3 md:w-4 md:h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <Package className="w-3 h-3 md:w-4 md:h-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <Heart className="w-3 h-3 md:w-4 md:h-4" />
                <span>Wishlist</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 md:space-y-6">
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                      <CardDescription className="text-sm md:text-base">Update your personal details and contact information</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 text-sm md:text-base"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProfileUpdate} className="bg-[#510c74] hover:bg-[#240334] text-white">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Track your orders and view order details</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#510c74] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                      <Button
                        onClick={() => router.push('/shop')}
                        className="bg-[#510c74] hover:bg-[#240334] text-white"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.orderStatus)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.orderStatus)}
                                <span className="capitalize">{order.orderStatus}</span>
                              </div>
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                  <span>{item.name} × {item.quantity}</span>
                                </div>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <div>
                              <span className="font-semibold">Total: ₹{order.total.toFixed(2)}</span>
                              <p className="text-xs text-gray-500 capitalize">
                                Payment: {order.paymentMethod} ({order.paymentStatus})
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // You can implement order details modal here
                                  toast({
                                    title: "Order Details",
                                    description: `Order #${order.orderNumber} details`,
                                  })
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                              {(order.orderStatus === 'confirmed' || order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewInvoice(order)}
                                  className="border-[#C9A34E] text-[#C9A34E] hover:bg-[#C9A34E] hover:text-white"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Invoice
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Explore our collection and save your favorite pieces!</p>
                      <Button
                        onClick={() => router.push('/shop')}
                        className="bg-[#510c74] hover:bg-[#240334] text-white px-8"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item._id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">{item.category}</p>
                            <h4
                              className="font-bold text-gray-900 mb-2 truncate cursor-pointer hover:text-[#510c74]"
                              onClick={() => router.push(`/view-details?id=${item._id}`)}
                            >
                              {item.name}
                            </h4>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-lg font-bold text-[#510c74]">₹{item.price.toFixed(2)}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#510c74] text-[#510c74] hover:bg-[#510c74] hover:text-white"
                                onClick={() => {
                                  addItem({
                                    id: item._id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    category: item.category,
                                    brand: "MARIYAE"
                                  })
                                  toast({
                                    title: "Added to Cart",
                                    description: `${item.name} has been added to your cart.`,
                                  })
                                }}
                              >
                                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
      <Footer />
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={selectedInvoiceOrder}
      />
    </div>
  )
}
