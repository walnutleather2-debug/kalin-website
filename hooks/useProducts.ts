import { useState, useEffect } from 'react'

export interface Product {
  _id: string
  name: string
  description: string
  keyFeatures: string[]
  price: number
  originalPrice?: number
  offerPercentage?: number
  isOnSale: boolean
  sizeConstraints?: string
  quantity: number
  category: string
  mainCategory?: string
  subCategory?: string
  images: Array<{ url: string; publicId: string }>
  videos: Array<{ url: string; publicId: string }>
  rating: number
  reviews: number
  isNew: boolean
  isActive: boolean
  isOutOfStock: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  name: string
  description: string
  keyFeatures: string[]
  price: number
  originalPrice?: number
  sizeConstraints?: string
  quantity: number
  category: string
  mainCategory?: string
  subCategory?: string
  images: File[]
  videos: File[]
  imageUrls?: string[]
  isOutOfStock?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {
  imagesToDelete?: string[]
  videosToDelete?: string[]
}

export interface ProductFilters {
  limit?: number
  category?: string
  subCategory?: string
  isNew?: boolean
  isOnSale?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch products with filters
  const fetchProducts = async (filters: ProductFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.category) params.append('category', filters.category)
      if (filters.subCategory) params.append('subCategory', filters.subCategory)
      if (filters.isNew) params.append('isNew', 'true')
      if (filters.isOnSale) params.append('isOnSale', 'true')
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.error || 'Failed to fetch products')
      }
    } catch (err) {
      setError('Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(initialFilters)
  }, [])

  // Create new product
  const createProduct = async (productData: CreateProductData): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)

      // 1. Upload images and videos client-side first
      let uploadedImages: Array<{ url: string, publicId: string }> = []
      let uploadedVideos: Array<{ url: string, publicId: string }> = []

      if (productData.images && productData.images.length > 0) {
        // Dynamic import to avoid SSR issues if any, though this is a hook
        const { uploadMultipleFilesClient } = await import('@/lib/client-upload')
        uploadedImages = await uploadMultipleFilesClient(productData.images, 'image')
      }

      if (productData.videos && productData.videos.length > 0) {
        const { uploadMultipleFilesClient } = await import('@/lib/client-upload')
        uploadedVideos = await uploadMultipleFilesClient(productData.videos, 'video')
      }

      // 2. Prepare JSON payload
      const payload = {
        name: productData.name,
        description: productData.description,
        keyFeatures: productData.keyFeatures,
        price: productData.price,
        originalPrice: productData.originalPrice,
        sizeConstraints: productData.sizeConstraints,
        quantity: productData.quantity,
        category: productData.category,
        mainCategory: productData.mainCategory,
        subCategory: productData.subCategory,
        // Send the uploaded result (URLs/IDs) instead of Files
        images: uploadedImages,
        videos: uploadedVideos,
        imageUrls: productData.imageUrls,
        isOutOfStock: productData.isOutOfStock || false
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        const newProduct = data.data
        setProducts(prev => [newProduct, ...prev])
        return newProduct
      } else {
        setError(data.error || 'Failed to create product')
        return null
      }
    } catch (err) {
      setError('Failed to create product')
      console.error('Error creating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update product
  const updateProduct = async (id: string, productData: UpdateProductData): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)

      // 1. Upload NEW images and videos client-side
      let newUploadedImages: Array<{ url: string, publicId: string }> = []
      let newUploadedVideos: Array<{ url: string, publicId: string }> = []

      if (productData.images && productData.images.length > 0) {
        const { uploadMultipleFilesClient } = await import('@/lib/client-upload')
        newUploadedImages = await uploadMultipleFilesClient(productData.images, 'image')
      }

      if (productData.videos && productData.videos.length > 0) {
        const { uploadMultipleFilesClient } = await import('@/lib/client-upload')
        newUploadedVideos = await uploadMultipleFilesClient(productData.videos, 'video')
      }

      // 2. Prepare JSON payload
      const payload = {
        name: productData.name,
        description: productData.description,
        keyFeatures: productData.keyFeatures,
        price: productData.price,
        originalPrice: productData.originalPrice,
        sizeConstraints: productData.sizeConstraints,
        quantity: productData.quantity,
        category: productData.category,
        mainCategory: productData.mainCategory,
        subCategory: productData.subCategory,
        imageUrls: productData.imageUrls,
        // Send the uploaded result (URLs/IDs)
        newImages: newUploadedImages,
        newVideos: newUploadedVideos,
        imagesToDelete: productData.imagesToDelete,
        videosToDelete: productData.videosToDelete,
        isOutOfStock: productData.isOutOfStock
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        const updatedProduct = data.data
        setProducts(prev => prev.map(p => p._id === id ? updatedProduct : p))
        return updatedProduct
      } else {
        setError(data.error || 'Failed to update product')
        return null
      }
    } catch (err) {
      setError('Failed to update product')
      console.error('Error updating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== id))
        return true
      } else {
        setError(data.error || 'Failed to delete product')
        return false
      }
    } catch (err) {
      setError('Failed to delete product')
      console.error('Error deleting product:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get single product
  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (data.success) {
        return data.data
      } else {
        setError(data.error || 'Failed to fetch product')
        return null
      }
    } catch (err) {
      setError('Failed to fetch product')
      console.error('Error fetching product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct
  }
}

