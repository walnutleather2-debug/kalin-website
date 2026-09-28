"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Package, Plus, Edit, Trash2, Eye, Search, Filter, MoreHorizontal, Lock, User, Image as ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/useProducts"
import { useOrders } from "@/hooks/useOrders"
import ProductForm from "@/components/ProductForm"
import OrderDetailModal from "@/components/OrderDetailModal"
import CategoryManagement from "@/components/category-management"
import BannerManagement from "@/components/banner-management"
import HandpickedManagement from "@/components/handpicked-management"
import ExcelUpload from "@/components/excel-upload"
import InvoiceModal from "@/components/InvoiceModal"

export default function DashboardPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts()
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders, updateOrder } = useOrders()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'categories' | 'banners' | 'signature'>('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [orderFilters, setOrderFilters] = useState({
    status: 'all',
    search: ''
  })
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null)

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        // Store user data in localStorage for persistence
        localStorage.setItem('mariyae_admin_user', JSON.stringify(data.data))
        localStorage.setItem('mariyae_admin_auth', 'true')
      } else {
        setLoginError(data.error || 'Login failed')
        setPassword('') // Clear password on failed attempt
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
      setPassword('')
    }
  }

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('mariyae_admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('mariyae_admin_auth')
    localStorage.removeItem('mariyae_admin_user')
    setUsername('')
    setPassword('')
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {/* Top spacing to prevent navbar overlap */}
        <div className="h-20 absolute top-0 left-0 right-0"></div>
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl" style={{ borderColor: '#d1b2e0', borderWidth: '1px' }}>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)' }}>
                <Lock className="h-6 w-6" style={{ color: '#C9A34E' }} />
              </div>
              <h2 className="mt-6 text-3xl font-bold gradient-text">Admin Login</h2>
              <p className="mt-2 text-sm" style={{ color: '#240334', opacity: 0.8 }}>
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#240334', opacity: 0.5 }} />
                    <Input
                      id="username"
                      type="email"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 rounded-lg"
                      style={{ borderColor: '#d1b2e0', backgroundColor: '#eae0cc' }}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#240334', opacity: 0.5 }} />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-lg"
                      style={{ borderColor: '#510c74/30', backgroundColor: '#fff4df' }}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="text-sm text-center p-3 rounded-md" style={{ backgroundColor: '#fff4df', color: '#510c74' }}>
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-white rounded-lg"
                style={{ background: 'linear-gradient(90deg, #510c74, #240334)', color: '#fff4df' }}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: '#240334', opacity: 0.7 }}>
                Demo Credentials:<br />
                Email: <span className="font-mono px-1 rounded" style={{ backgroundColor: '#d1b2e0' }}>admin@mariyae.com</span><br />
                Password: <span className="font-mono px-1 rounded" style={{ backgroundColor: '#d1b2e0' }}>admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCreateProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct._id, productData)
      } else {
        // Create new product
        await createProduct(productData)
      }
      setShowAddForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId)
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleViewInvoice = (order: any) => {
    setSelectedInvoiceOrder(order)
    setShowInvoiceModal(true)
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, {
        orderStatus: newStatus as any
      })
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, {
        paymentStatus: newStatus as any
      })
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }

  const handleOrderUpdate = async (orderId: string, data: any) => {
    try {
      await updateOrder(orderId, data)
      // Refresh orders after update
      fetchOrders(orderFilters)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <div className="flex space-x-3">
          <Button
            onClick={() => setActiveTab('banners')}
            variant="outline"
            className="rounded-lg"
            style={{ borderColor: '#C9A34E', color: '#240334' }}
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            Manage Banners
          </Button>
          <Button
            onClick={() => setShowBulkUpload(true)}
            variant="outline"
            className="rounded-lg"
            style={{ borderColor: '#510c74', color: '#510c74' }}
          >
            <Package className="w-5 h-5 mr-2" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="text-white rounded-lg"
            style={{ background: 'linear-gradient(90deg, #510c74, #240334)', color: '#fff4df' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md" style={{ borderColor: '#510c74/10', borderWidth: '1px' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#d1b2e0' }}>
              <Package className="w-6 h-6" style={{ color: '#240334' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#240334', opacity: 0.7 }}>Total Products</p>
              <p className="text-2xl font-bold" style={{ color: '#240334' }}>{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md" style={{ borderColor: '#510c74/10', borderWidth: '1px' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#d1b2e0' }}>
              <Package className="w-6 h-6" style={{ color: '#240334' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#240334', opacity: 0.7 }}>Active Products</p>
              <p className="text-2xl font-bold" style={{ color: '#240334' }}>
                {products.filter(p => p.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md" style={{ borderColor: '#510c74/10', borderWidth: '1px' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#d1b2e0' }}>
              <Package className="w-6 h-6" style={{ color: '#240334' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#240334', opacity: 0.7 }}>New Products</p>
              <p className="text-2xl font-bold" style={{ color: '#240334' }}>
                {products.filter(p => p.isNew).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md" style={{ borderColor: '#510c74/10', borderWidth: '1px' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#fff4df' }}>
              <Package className="w-6 h-6" style={{ color: '#240334' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#240334', opacity: 0.7 }}>On Sale</p>
              <p className="text-2xl font-bold" style={{ color: '#240334' }}>
                {products.filter(p => p.isOnSale).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center" style={{ color: '#240334', opacity: 0.7 }}>
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center" style={{ color: '#240334' }}>
                    Error: {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center" style={{ color: '#240334', opacity: 0.7 }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.slice(0, 10).map((product) => (
                  <tr key={product._id} style={{ borderColor: '#d1b2e0' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium" style={{ color: '#240334' }}>{product.name}</div>
                          <div className="text-sm" style={{ color: '#240334', opacity: 0.6 }}>ID: {product._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#d1b2e0', color: '#240334' }}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#C9A34E', fontWeight: 'bold' }}>
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {product.isNew && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#d1b2e0', color: '#240334' }}>
                            NEW
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#d1b2e0', color: '#240334' }}>
                            SALE
                          </span>
                        )}
                        {product.isOutOfStock && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                            OUT OF STOCK
                          </span>
                        )}
                        {product.isActive === false && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#d1b2e0', color: '#240334', opacity: 0.5 }}>
                            INACTIVE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={`/view-details?id=${product._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const OrdersInventoryContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders & Inventory</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.orderStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.orderStatus === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders by order number, customer name, or email..."
                value={orderFilters.search}
                onChange={(e) => setOrderFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={orderFilters.status}
              onValueChange={(value) => setOrderFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => fetchOrders(orderFilters)}
            className="bg-[#C4A484] hover:bg-[#B39474]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : ordersError ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                    Error: {ordersError}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerDetails.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                            <span className="truncate max-w-24">{item.name}</span>
                            <span className="text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        defaultValue={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="h-8 w-32 bg-white border border-[#510c74]/20 rounded-md text-sm px-2 focus:outline-none focus:ring-2 focus:ring-[#510c74]/50 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[10px] text-gray-400 mb-1 capitalize truncate max-w-[80px]">
                        {order.paymentMethod}
                      </div>
                      <select
                        defaultValue={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                        className={`h-7 w-28 text-[10px] font-bold rounded-md px-1 focus:outline-none cursor-pointer ${order.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: '#510c74' }}
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(order.orderStatus === 'confirmed' || order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                          <button
                            onClick={() => handleViewInvoice(order)}
                            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: '#C9A34E' }}
                            title="View Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Top spacing to prevent navbar overlap */}
      <div className="h-20"></div>
      {/* Top Navigation Bar */}
      <div className="shadow-sm border-b border-[#510c74]/10" style={{ background: '#fff4df' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white opacity-90">Welcome, Admin</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-white/30 text-white hover:bg-white/20">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 shadow-lg min-h-screen" style={{ background: 'linear-gradient(180deg, #240334, #510c74, #670099)' }}>
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'dashboard'
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === 'dashboard' ? { background: 'rgba(209, 178, 224, 0.2)', borderLeft: '3px solid #C9A34E' } : {}}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'orders'
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === 'orders' ? { background: 'rgba(209, 178, 224, 0.2)', borderLeft: '3px solid #C9A34E' } : {}}
              >
                <Package className="w-5 h-5 mr-3" />
                Orders & Inventory
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'categories'
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === 'categories' ? { background: 'rgba(209, 178, 224, 0.2)', borderLeft: '3px solid #C9A34E' } : {}}
              >
                <Package className="w-5 h-5 mr-3" />
                Categories
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'banners'
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === 'banners' ? { background: 'rgba(209, 178, 224, 0.2)', borderLeft: '3px solid #C9A34E' } : {}}
              >
                <ImageIcon className="w-5 h-5 mr-3" />
                Banners
              </button>

              <button
                onClick={() => setActiveTab('signature')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'signature'
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === 'signature' ? { background: 'rgba(209, 178, 224, 0.2)', borderLeft: '3px solid #C9A34E' } : {}}
              >
                <Plus className="w-5 h-5 mr-3" />
                Signature Collection
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' ? <DashboardContent /> :
            activeTab === 'orders' ? <OrdersInventoryContent /> :
              activeTab === 'categories' ? <CategoryManagement /> :
                activeTab === 'banners' ? <BannerManagement /> :
                  <HandpickedManagement />}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ borderColor: '#d1b2e0', borderWidth: '1px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProduct(null)
                }}
                className="rounded-lg"
                style={{ borderColor: '#d1b2e0', color: '#240334' }}
              >
                ✕
              </Button>
            </div>

            <ProductForm
              isOpen={showAddForm}
              onClose={() => {
                setShowAddForm(false)
                setEditingProduct(null)
              }}
              onSubmit={handleCreateProduct}
              product={editingProduct}
              mode={editingProduct ? 'edit' : 'create'}
            />
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setSelectedOrder(null)
        }}
        onUpdate={handleOrderUpdate}
      />

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold gradient-text">
                Bulk Upload Products
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowBulkUpload(false)}
                className="rounded-lg"
                style={{ borderColor: '#d1b2e0', color: '#240334' }}
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <ExcelUpload
                onUploadComplete={() => {
                  setShowBulkUpload(false)
                  // Refresh products list
                  window.location.reload()
                }}
              />
            </div>
          </div>
        </div>
      )}

      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false)
          setSelectedInvoiceOrder(null)
        }}
      />
    </div>
  )
}
