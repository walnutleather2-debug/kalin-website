"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface MainCategory {
  _id: string
  name: string
  image: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface SubCategory {
  _id: string
  name: string
  mainCategory: string
  image: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export default function CategoryManagement() {
  const { toast } = useToast()
  const [activeSubTab, setActiveSubTab] = useState<'main' | 'sub'>('main')
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(false)
  
  // Main Category Form State
  const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false)
  const [editingMainCategory, setEditingMainCategory] = useState<MainCategory | null>(null)
  const [mainCategoryForm, setMainCategoryForm] = useState({
    name: '',
    image: ''
  })
  
  // Sub Category Form State
  const [showSubCategoryDialog, setShowSubCategoryDialog] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    mainCategory: '',
    image: ''
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const [mainRes, subRes] = await Promise.all([
        fetch('/api/categories/main'),
        fetch('/api/categories/sub')
      ])
      
      const mainData = await mainRes.json()
      const subData = await subRes.json()
      
      if (mainData.success) {
        setMainCategories(mainData.categories || [])
      }
      if (subData.success) {
        setSubCategories(subData.subCategories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Main Category Handlers
  const handleMainCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mainCategoryForm.name) {
      return
    }

    try {
      const url = editingMainCategory
        ? `/api/categories/main/${editingMainCategory._id}`
        : '/api/categories/main'
      
      const method = editingMainCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mainCategoryForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: editingMainCategory
            ? "Main category updated successfully"
            : "Main category created successfully"
        })
        setShowMainCategoryDialog(false)
        setMainCategoryForm({ name: '', image: '' })
        setEditingMainCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save main category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save main category",
        variant: "destructive"
      })
    }
  }

  const handleDeleteMainCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this main category? All sub-categories will also be affected.')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/main/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Main category deleted successfully"
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete main category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete main category",
        variant: "destructive"
      })
    }
  }

  // Sub Category Handlers
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subCategoryForm.name) {
      return
    }

    try {
      const url = editingSubCategory
        ? `/api/categories/sub/${editingSubCategory._id}`
        : '/api/categories/sub'
      
      const method = editingSubCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subCategoryForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: editingSubCategory
            ? "Sub category updated successfully"
            : "Sub category created successfully"
        })
        setShowSubCategoryDialog(false)
        setSubCategoryForm({ name: '', mainCategory: '', image: '' })
        setEditingSubCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save sub category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sub category",
        variant: "destructive"
      })
    }
  }

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub category?')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/sub/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Sub category deleted successfully"
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete sub category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sub category",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Category Management</h1>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #d1b2e0' }}>
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSubTab('main')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSubTab === 'main'
                ? ''
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            style={activeSubTab === 'main' ? { borderColor: '#C9A34E', color: '#240334' } : { color: '#240334' }}
          >
            Main Categories
          </button>
          <button
            onClick={() => setActiveSubTab('sub')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSubTab === 'sub'
                ? ''
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            style={activeSubTab === 'sub' ? { borderColor: '#C9A34E', color: '#240334' } : { color: '#240334' }}
          >
            Sub Categories
          </button>
        </nav>
      </div>

      {/* Main Categories Tab */}
      {activeSubTab === 'main' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: '#240334' }}>Main Categories</h2>
            <Button
              onClick={() => {
                setMainCategoryForm({ name: '', image: '' })
                setEditingMainCategory(null)
                setShowMainCategoryDialog(true)
              }}
              className="text-white rounded-lg"
              style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Main Category
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8" style={{ color: '#240334', opacity: 0.7 }}>Loading...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ borderColor: '#d1b2e0', borderWidth: '1px' }}>
              <table className="min-w-full divide-y" style={{ borderColor: '#d1b2e0' }}>
                <thead style={{ backgroundColor: '#d1b2e0' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Image URL
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y" style={{ borderColor: '#d1b2e0' }}>
                  {mainCategories.map((category) => (
                    <tr key={category._id} style={{ borderColor: '#d1b2e0' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#240334' }}>
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#240334', opacity: 0.7 }}>
                        {category.image || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setMainCategoryForm({
                              name: category.name,
                              image: category.image || ''
                            })
                            setEditingMainCategory(category)
                            setShowMainCategoryDialog(true)
                          }}
                          className="mr-4 p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMainCategory(category._id)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {mainCategories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm" style={{ color: '#240334', opacity: 0.7 }}>
                        No main categories found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sub Categories Tab */}
      {activeSubTab === 'sub' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: '#240334' }}>Sub Categories</h2>
            <Button
              onClick={() => {
                setSubCategoryForm({ name: '', mainCategory: '', image: '' })
                setEditingSubCategory(null)
                setShowSubCategoryDialog(true)
              }}
              className="text-white rounded-lg"
              style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sub Category
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8" style={{ color: '#240334', opacity: 0.7 }}>Loading...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ borderColor: '#d1b2e0', borderWidth: '1px' }}>
              <table className="min-w-full divide-y" style={{ borderColor: '#d1b2e0' }}>
                <thead style={{ backgroundColor: '#d1b2e0' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Main Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Image URL
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#240334' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y" style={{ borderColor: '#d1b2e0' }}>
                  {subCategories.map((category) => (
                    <tr key={category._id} style={{ borderColor: '#d1b2e0' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#240334' }}>
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#240334', opacity: 0.7 }}>
                        {category.mainCategory}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#240334', opacity: 0.7 }}>
                        {category.image || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSubCategoryForm({
                              name: category.name,
                              mainCategory: category.mainCategory,
                              image: category.image || ''
                            })
                            setEditingSubCategory(category)
                            setShowSubCategoryDialog(true)
                          }}
                          className="mr-4 p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubCategory(category._id)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#240334' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subCategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm" style={{ color: '#240334', opacity: 0.7 }}>
                        No sub categories found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Main Category Dialog */}
      {showMainCategoryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" style={{ borderColor: '#d1b2e0', borderWidth: '1px' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold gradient-text">
                {editingMainCategory ? 'Edit Main Category' : 'Add Main Category'}
              </h2>
              <button
                onClick={() => {
                  setShowMainCategoryDialog(false)
                  setMainCategoryForm({ name: '', image: '' })
                  setEditingMainCategory(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                style={{ color: '#240334', opacity: 0.7 }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleMainCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={mainCategoryForm.name}
                  onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, name: e.target.value })}
                  placeholder="e.g., Mens, Womens, Kids, etc."
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', backgroundColor: '#eae0cc' }}
                />
                <p className="mt-1 text-xs" style={{ color: '#240334', opacity: 0.6 }}>
                  Enter the name of the main category
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                  Category Image URL
                </label>
                <Input
                  type="url"
                  value={mainCategoryForm.image}
                  onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', backgroundColor: '#eae0cc' }}
                />
                <p className="mt-1 text-xs" style={{ color: '#240334', opacity: 0.6 }}>
                  Image URL for the category card (used in collections page)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMainCategoryDialog(false)
                    setMainCategoryForm({ name: '', image: '' })
                    setEditingMainCategory(null)
                  }}
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', color: '#240334', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!mainCategoryForm.name}
                  className="text-white rounded-lg"
                  style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
                >
                  {editingMainCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub Category Dialog */}
      {showSubCategoryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
              </h2>
              <button
                onClick={() => {
                  setShowSubCategoryDialog(false)
                  setSubCategoryForm({ name: '', mainCategory: '', image: '' })
                  setEditingSubCategory(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                  Main Category
                </label>
                <select
                  value={subCategoryForm.mainCategory}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, mainCategory: e.target.value })}
                  className="w-full rounded-lg px-3 py-2"
                  style={{ 
                    borderColor: '#d1b2e0', 
                    backgroundColor: '#eae0cc',
                    color: '#240334',
                    borderWidth: '1px'
                  }}
                >
                  <option value="">Select main category (optional)</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                  Sub Category Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={subCategoryForm.name}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                  placeholder="e.g., Rider, Bomber, Biker"
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', backgroundColor: '#eae0cc' }}
                />
                <p className="mt-1 text-xs" style={{ color: '#240334', opacity: 0.6 }}>
                  Name of the jacket type (e.g., Rider, Bomber, Biker)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#240334' }}>
                  Category Image URL
                </label>
                <Input
                  type="url"
                  value={subCategoryForm.image}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', backgroundColor: '#eae0cc' }}
                />
                <p className="mt-1 text-xs" style={{ color: '#240334', opacity: 0.6 }}>
                  Image URL for the sub category card (used in collections page)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowSubCategoryDialog(false)
                    setSubCategoryForm({ name: '', mainCategory: '', image: '' })
                    setEditingSubCategory(null)
                  }}
                  className="rounded-lg"
                  style={{ borderColor: '#d1b2e0', color: '#240334', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d1b2e0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!subCategoryForm.name}
                  className="text-white rounded-lg"
                  style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
                >
                  {editingSubCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

