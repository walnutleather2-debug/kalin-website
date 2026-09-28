"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Banner {
  _id: string
  order: number
  eyebrowText: string
  headline: string
  description: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
  layoutType: 'normal' | 'reversed'
  backgroundImage: string
  decorativeImage: string
  isActive: boolean
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    order: 0,
    eyebrowText: '',
    headline: '',
    description: '',
    button1Text: '',
    button1Link: '',
    button2Text: '',
    button2Link: '',
    layoutType: 'normal' as 'normal' | 'reversed',
    backgroundImage: '',
    backgroundImageUrl: '',
    decorativeImage: '',
    decorativeImageUrl: ''
  })
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null)
  const [decorativeImageFile, setDecorativeImageFile] = useState<File | null>(null)
  const [bannerMode, setBannerMode] = useState<'structured' | 'simple'>('structured')

  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>('')
  const [decorativeImagePreview, setDecorativeImagePreview] = useState<string>('')

  useEffect(() => {
    fetchBanners()
  }, [])

  // Handle image previews
  useEffect(() => {
    if (backgroundImageFile) {
      const url = URL.createObjectURL(backgroundImageFile)
      setBackgroundImagePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setBackgroundImagePreview(formData.backgroundImage || '')
    }
  }, [backgroundImageFile, formData.backgroundImage])

  useEffect(() => {
    if (decorativeImageFile) {
      const url = URL.createObjectURL(decorativeImageFile)
      setDecorativeImagePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setDecorativeImagePreview(formData.decorativeImage || '')
    }
  }, [decorativeImageFile, formData.decorativeImage])

  const fetchBanners = async () => {
    // ... same as before but ensured it's using banners property from data
    try {
      setLoading(true)
      const response = await fetch('/api/banners')
      const data = await response.json()
      if (data.success) {
        setBanners(data.banners || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      const isSimple = !banner.headline && !banner.description
      setBannerMode(isSimple ? 'simple' : 'structured')
      setFormData({
        order: banner.order,
        eyebrowText: banner.eyebrowText || '',
        headline: banner.headline || '',
        description: banner.description || '',
        button1Text: banner.button1Text || '',
        button1Link: banner.button1Link || '',
        button2Text: banner.button2Text || '',
        button2Link: banner.button2Link || '',
        layoutType: banner.layoutType,
        backgroundImage: banner.backgroundImage,
        backgroundImageUrl: '',
        decorativeImage: banner.decorativeImage || '',
        decorativeImageUrl: ''
      })
    } else {
      setEditingBanner(null)
      setBannerMode('structured') // Default to structured for new
      setFormData({
        order: banners.length,
        eyebrowText: '',
        headline: '',
        description: '',
        button1Text: '',
        button1Link: '',
        button2Text: '',
        button2Link: '',
        layoutType: 'normal',
        backgroundImage: '',
        backgroundImageUrl: '',
        decorativeImage: '',
        decorativeImageUrl: ''
      })
    }
    setBackgroundImageFile(null)
    setDecorativeImageFile(null)
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setEditingBanner(null)
    setBackgroundImagePreview('')
    setDecorativeImagePreview('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // 1. Upload images client-side first
      const { uploadToCloudinaryClient } = await import('@/lib/client-upload')

      let backgroundImage = formData.backgroundImage
      let decorativeImage = formData.decorativeImage

      if (backgroundImageFile) {
        const result = await uploadToCloudinaryClient(backgroundImageFile, 'image', 'kalin/banners')
        backgroundImage = result.url
      } else if (formData.backgroundImageUrl) {
        // Fallback for URL if still using it, but we favor direct upload
        backgroundImage = formData.backgroundImageUrl
      }

      if (decorativeImageFile) {
        const result = await uploadToCloudinaryClient(decorativeImageFile, 'image', 'kalin/banners')
        decorativeImage = result.url
      } else if (formData.decorativeImageUrl) {
        decorativeImage = formData.decorativeImageUrl
      }

      // 2. Prepare JSON payload
      const payload: any = {
        order: formData.order,
        isActive: true,
        backgroundImage,
        decorativeImage: decorativeImage || '',
        layoutType: formData.layoutType
      }

      if (bannerMode === 'structured') {
        payload.eyebrowText = formData.eyebrowText
        payload.headline = formData.headline
        payload.description = formData.description
        payload.button1Text = formData.button1Text
        payload.button1Link = formData.button1Link
        payload.button2Text = formData.button2Text
        payload.button2Link = formData.button2Link
      } else {
        payload.eyebrowText = ''
        payload.headline = ''
        payload.description = ''
        payload.button1Link = formData.button1Link
      }

      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners'
      const method = editingBanner ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!')
        fetchBanners()
        handleCloseDialog()
      } else {
        alert(data.error || 'Failed to save banner')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Failed to save banner')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Banner deleted successfully!')
        fetchBanners()
      } else {
        alert(data.error || 'Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Failed to delete banner')
    } finally {
      setLoading(false)
    }
  }

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      setLoading(true)

      const response = await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !banner.isActive
        })
      })

      const data = await response.json()
      if (data.success) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error toggling banner status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#240334]">Banner Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage hero section banners and promotions</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      {loading && banners.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#510c74] mx-auto mb-4"></div>
          <p style={{ color: '#240334' }}>Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-[#d1b2e0]">
          <ImageIcon className="w-12 h-12 text-[#d1b2e0] mx-auto mb-4" />
          <p className="text-lg font-medium" style={{ color: '#240334' }}>No banners found</p>
          <p className="text-sm text-gray-500 mb-6">Create your first banner to showcase on the home page</p>
          <Button
            onClick={() => handleOpenDialog()}
            variant="outline"
            style={{ borderColor: '#510c74', color: '#510c74' }}
          >
            Create First Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border ${banner.isActive ? 'border-[#d1b2e0]' : 'border-gray-200 grayscale-[0.5]'}`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Banner Preview Thumbnail */}
                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
                  {banner.backgroundImage ? (
                    <img
                      src={banner.backgroundImage}
                      alt={banner.headline}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Banner Content Sidebar */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#C9A34E] uppercase tracking-widest">{banner.eyebrowText}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">Order: {banner.order}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#240334] mb-2">{banner.headline}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{banner.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-[#510c74]"></span>
                          Button 1: {banner.button1Text || 'None'}
                        </div>
                        {banner.button2Text && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-[#C9A34E]"></span>
                            Button 2: {banner.button2Text}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-[#d1b2e0]"></span>
                          Layout: {banner.layoutType}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => toggleBannerStatus(banner)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-[#510c74]"
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleOpenDialog(banner)}
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-[#d1b2e0] text-[#240334] hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(banner._id)}
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-red-100 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-[#240334]">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
                <p className="text-sm text-gray-500">Configure your hero section promotional banner</p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
              {/* Mode Selection */}
              <div className="flex gap-4 mb-8 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setBannerMode('structured')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bannerMode === 'structured' ? 'bg-white text-[#510c74] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Custom Text Format
                </button>
                <button
                  type="button"
                  onClick={() => setBannerMode('simple')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bannerMode === 'simple' ? 'bg-white text-[#510c74] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Direct Image Upload
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Details */}
                <div className={`lg:col-span-12 space-y-6 ${bannerMode === 'simple' ? 'block' : 'lg:col-span-7'}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Display Order</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="rounded-xl border-[#d1b2e0] h-11"
                        required
                      />
                    </div>
                    {bannerMode === 'structured' && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Layout Style</label>
                        <select
                          value={formData.layoutType}
                          onChange={(e) => setFormData({ ...formData, layoutType: e.target.value as 'normal' | 'reversed' })}
                          className="w-full border border-[#d1b2e0] rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#510c74]/20"
                        >
                          <option value="normal">Image Left, Text Right</option>
                          <option value="reversed">Text Left, Image Right</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {bannerMode === 'structured' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Eyebrow Text (Small Label)</label>
                        <Input
                          type="text"
                          value={formData.eyebrowText}
                          onChange={(e) => setFormData({ ...formData, eyebrowText: e.target.value })}
                          placeholder="e.g., Summer Collection 2024"
                          className="rounded-xl border-[#d1b2e0] h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Headline *</label>
                        <Input
                          type="text"
                          value={formData.headline}
                          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                          placeholder="e.g., Exquisite Diamond Necklaces"
                          className="rounded-xl border-[#d1b2e0] h-12 text-lg font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Description *</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full border border-[#d1b2e0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#510c74]/20"
                          placeholder="Enter a compelling description for your banner..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Primary Button</label>
                            <Input
                              type="text"
                              value={formData.button1Text}
                              onChange={(e) => setFormData({ ...formData, button1Text: e.target.value })}
                              placeholder="Label (e.g., Shop Now)"
                              className="rounded-xl border-[#d1b2e0] h-10"
                            />
                          </div>
                          <Input
                            type="text"
                            value={formData.button1Link}
                            onChange={(e) => setFormData({ ...formData, button1Link: e.target.value })}
                            placeholder="Link (e.g., /shop)"
                            className="rounded-xl border-[#d1b2e0] h-10"
                          />
                        </div>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secondary Button</label>
                            <Input
                              type="text"
                              value={formData.button2Text}
                              onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                              placeholder="Label (e.g., Learn More)"
                              className="rounded-xl border-[#d1b2e0] h-10"
                            />
                          </div>
                          <Input
                            type="text"
                            value={formData.button2Link}
                            onChange={(e) => setFormData({ ...formData, button2Link: e.target.value })}
                            placeholder="Link"
                            className="rounded-xl border-[#d1b2e0] h-10"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Banner Click Link (Optional)</label>
                      <Input
                        type="text"
                        value={formData.button1Link}
                        onChange={(e) => setFormData({ ...formData, button1Link: e.target.value })}
                        placeholder="e.g., /products/necklace"
                        className="rounded-xl border-[#d1b2e0] h-11"
                      />
                      <p className="text-xs text-gray-400 mt-1 italic text-center">In "Direct Image Upload" mode, the entire banner image will be clickable to this link.</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Images */}
                <div className={`lg:col-span-12 ${bannerMode === 'structured' ? 'lg:col-span-5' : 'max-w-4xl mx-auto w-full'} space-y-8`}>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">
                      {bannerMode === 'simple' ? 'Complete Banner Image *' : 'Main Background Image *'}
                    </label>
                    <div className="relative group aspect-video rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-[#d1b2e0] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      {backgroundImagePreview ? (
                        <div className="absolute inset-0">
                          <img src={backgroundImagePreview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-10 h-10 text-[#d1b2e0] mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Click to upload banner</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBackgroundImageFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required={!editingBanner && !formData.backgroundImageUrl}
                      />
                    </div>
                  </div>

                  {bannerMode === 'structured' && (
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-[#240334] uppercase tracking-wider">Decorative/Product Image</label>
                      <div className="relative group aspect-square max-w-[200px] border-2 border-dashed border-[#d1b2e0] rounded-2xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mx-auto">
                        {decorativeImagePreview ? (
                          <div className="absolute inset-0">
                            <img src={decorativeImagePreview} className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold uppercase">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-6 h-6 text-[#d1b2e0] mx-auto mb-1" />
                            <p className="text-[10px] text-gray-500">Product cutout (PNG)</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setDecorativeImageFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 text-center italic">Transparent PNG recommended for best effect</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseDialog}
                  className="rounded-xl h-12 px-8 text-gray-500"
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl h-12 px-12 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'linear-gradient(90deg, #670099, #510c74, #240334)', color: '#C9A34E' }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : editingBanner ? 'Update Banner' : 'Publish Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



