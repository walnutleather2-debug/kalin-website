"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Package, Plus, Edit, Trash2, Eye, Search, Filter, MoreHorizontal, Lock, User, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, RotateCcw } from "lucide-react"
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
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts({ includeInactive: true })
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

  // Product Search and Pagination state
  const [productSearchInput, setProductSearchInput] = useState('')
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')
  const [productStatusFilter, setProductStatusFilter] = useState('all')
  const [productSortBy, setProductSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  // Derived unique categories for filter
  const availableCategories = Array.from(
    new Set(
      products
        .map(p => p.category)
        .filter((c): c is string => Boolean(c && typeof c === 'string' && c.trim()))
    )
  ).sort()

  // Filter products by search query, category, status
  const filteredProducts = products.filter(product => {
    // 1. Search Query filter (matches name, category, subCategory, mainCategory, ID, description)
    if (productSearchQuery) {
      const q = productSearchQuery.toLowerCase().trim()
      const nameMatch = product.name?.toLowerCase().includes(q)
      const categoryMatch = product.category?.toLowerCase().includes(q)
      const subCategoryMatch = product.subCategory?.toLowerCase().includes(q)
      const mainCategoryMatch = product.mainCategory?.toLowerCase().includes(q)
      const idMatch = product._id?.toLowerCase().includes(q)
      const descMatch = product.description?.toLowerCase().includes(q)

      if (!nameMatch && !categoryMatch && !subCategoryMatch && !mainCategoryMatch && !idMatch && !descMatch) {
        return false
      }
    }

    // 2. Category filter
    if (productCategoryFilter !== 'all') {
      const catMatch = product.category === productCategoryFilter ||
        product.mainCategory === productCategoryFilter ||
        product.subCategory === productCategoryFilter
      if (!catMatch) return false
    }

    // 3. Status filter
    if (productStatusFilter === 'active' && product.isActive === false) return false
    if (productStatusFilter === 'inactive' && product.isActive !== false) return false
    if (productStatusFilter === 'in_stock' && product.isOutOfStock) return false
    if (productStatusFilter === 'out_of_stock' && !product.isOutOfStock) return false
    if (productStatusFilter === 'on_sale' && !product.isOnSale) return false
    if (productStatusFilter === 'new' && !product.isNew) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (productSortBy === 'price-low') {
      return (a.price || 0) - (b.price || 0)
    }
    if (productSortBy === 'price-high') {
      return (b.price || 0) - (a.price || 0)
    }
    if (productSortBy === 'name-asc') {
      return (a.name || '').localeCompare(b.name || '')
    }
    if (productSortBy === 'name-desc') {
      return (b.name || '').localeCompare(a.name || '')
    }
    if (productSortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    }
    // Default: newest first
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })

  // Pagination calculations
  const totalItems = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const validPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (validPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const hasActiveProductFilters = Boolean(
    productSearchQuery || productCategoryFilter !== 'all' || productStatusFilter !== 'all'
  )

  const handleProductSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setProductSearchQuery(productSearchInput.trim())
    setCurrentPage(1)
  }

  const handleClearProductSearch = () => {
    setProductSearchInput('')
    setProductSearchQuery('')
    setProductCategoryFilter('all')
    setProductStatusFilter('all')
    setProductSortBy('newest')
    setCurrentPage(1)
  }

  // Adjust page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // Helper for pagination page numbers with smart ellipsis
  const getPaginationPages = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (validPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (validPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages)
      }
    }
    return pages
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

      {/* Product Search & Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleProductSearch} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, category, or ID..."
              value={productSearchInput}
              onChange={(e) => setProductSearchInput(e.target.value)}
              className="pl-10 pr-9 rounded-lg border-gray-300 focus:border-[#510c74]"
            />
            {productSearchInput && (
              <button
                type="button"
                onClick={() => {
                  setProductSearchInput('')
                  setProductSearchQuery('')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="text-white rounded-lg shadow-sm px-5"
            style={{ background: 'linear-gradient(90deg, #510c74, #240334)', color: '#fff4df' }}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

          {/* Category Filter */}
          <div className="w-full md:w-44">
            <Select
              value={productCategoryFilter}
              onValueChange={(val) => {
                setProductCategoryFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-300">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-40">
            <Select
              value={productStatusFilter}
              onValueChange={(val) => {
                setProductStatusFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="on_sale">On Sale</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="w-full md:w-40">
            <Select
              value={productSortBy}
              onValueChange={(val) => {
                setProductSortBy(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button (only shown if filters/search applied) */}
          {hasActiveProductFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearProductSearch}
              className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
          )}
        </form>

        {/* Active Filter Badges */}
        {hasActiveProductFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500">Active filters:</span>
            {productSearchQuery && (
              <Badge variant="secondary" className="gap-1 pr-1 bg-purple-50 text-[#510c74] border border-[#510c74]/20">
                Search: "{productSearchQuery}"
                <button
                  type="button"
                  onClick={() => {
                    setProductSearchInput('')
                    setProductSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="hover:bg-purple-200/50 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {productCategoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1 bg-purple-50 text-[#510c74] border border-[#510c74]/20">
                Category: {productCategoryFilter}
                <button
                  type="button"
                  onClick={() => {
                    setProductCategoryFilter('all')
                    setCurrentPage(1)
                  }}
                  className="hover:bg-purple-200/50 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {productStatusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1 bg-purple-50 text-[#510c74] border border-[#510c74]/20">
                Status: {productStatusFilter.replace('_', ' ')}
                <button
                  type="button"
                  onClick={() => {
                    setProductStatusFilter('all')
                    setCurrentPage(1)
                  }}
                  className="hover:bg-purple-200/50 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={handleClearProductSearch}
              className="text-xs text-[#510c74] hover:underline ml-1 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {productSearchQuery ? 'Search Results' : 'All Products'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {productSearchQuery
                ? `Found ${totalItems} product${totalItems === 1 ? '' : 's'} matching "${productSearchQuery}"`
                : `Total ${totalItems} product${totalItems === 1 ? '' : 's'} available`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-8 text-xs bg-white border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#510c74]"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
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
                  <td colSpan={5} className="px-6 py-12 text-center" style={{ color: '#240334', opacity: 0.7 }}>
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#510c74] mb-2"></div>
                    <p className="text-sm">Loading products...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-gray-700">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {hasActiveProductFilters
                        ? "Try adjusting your search criteria or filters to find what you're looking for."
                        : "No products available in your catalog."}
                    </p>
                    {hasActiveProductFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearProductSearch}
                        className="mt-4 rounded-lg border-gray-300 text-[#510c74]"
                      >
                        <RotateCcw className="w-4 h-4 mr-1.5" />
                        Clear Search & Filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b transition-colors hover:bg-purple-50/40"
                    style={{ borderColor: '#d1b2e0' }}
                  >
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
                          <div className="text-xs font-mono" style={{ color: '#240334', opacity: 0.6 }}>ID: {product._id.slice(-8)}</div>
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
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#e2e8f0', color: '#64748b' }}>
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
                          title="Edit Product"
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1 rounded transition-colors text-red-600 hover:text-red-800"
                          title="Delete Product"
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2' }}
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
                          title="View Details"
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

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          {/* Summary */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> products
          </div>

          {/* Page Controls */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={validPage === 1}
                className="h-8 w-8 p-0"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>

              {getPaginationPages().map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">
                      ...
                    </span>
                  )
                }
                const isCurrent = page === validPage
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`h-8 min-w-[32px] px-2 text-xs font-medium rounded-md transition-colors ${
                      isCurrent
                        ? 'text-white shadow-sm'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                    style={isCurrent ? { backgroundColor: '#510c74' } : {}}
                  >
                    {page}
                  </button>
                )
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="h-8 px-2.5 text-xs"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validPage === totalPages}
                className="h-8 w-8 p-0"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
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
