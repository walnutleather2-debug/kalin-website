"use client"

import { useState, useEffect } from "react"
import { Edit, Save, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface HandpickedItem {
    _id?: string
    slot: 'left' | 'top-right' | 'bottom-right'
    image: string
    subtitle: string
    title: string
    link: string
    isActive: boolean
}

interface SlotCardProps {
    slot: string
    label: string
    item: any
    isEditing: boolean
    formData: any
    setFormData: (data: any) => void
    handleEdit: (item: any) => void
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSave: (slot: string) => void
    saving: string | null
    setEditingSlot: (slot: string | null) => void
}

const SlotCard = ({
    slot,
    label,
    item,
    isEditing,
    formData,
    setFormData,
    handleEdit,
    handleFileChange,
    handleSave,
    saving,
    setEditingSlot
}: SlotCardProps) => {
    return (
        <div className={`border-2 rounded-2xl overflow-hidden transition-all ${isEditing ? 'border-[#510c74] ring-2 ring-[#510c74]/10' : 'border-gray-100'}`}>
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-[#240334] uppercase tracking-wider">{label}</span>
                {!isEditing ? (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-[#510c74]">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingSlot(null)} className="text-gray-500">
                            Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSave(slot)} disabled={saving === slot} className="bg-[#510c74]">
                            {saving === slot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border">
                        {(isEditing ? formData.imagePreview : item.image) ? (
                            <img
                                src={isEditing ? formData.imagePreview : item.image}
                                className="w-full h-full object-cover"
                                alt={item.title}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-xs">No image</span>
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
                                <label
                                    htmlFor={`file-upload-${slot}`}
                                    className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-wider border border-white/40 transition-colors"
                                >
                                    Change Image
                                </label>
                                <input
                                    id={`file-upload-${slot}`}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Title (Bold)</label>
                            {isEditing ? (
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="h-10 rounded-lg border-gray-200"
                                />
                            ) : (
                                <p className="text-lg font-bold text-[#240334]">{item.title}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Link</label>
                            {isEditing ? (
                                <Input
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="h-10 rounded-lg border-gray-200"
                                    placeholder="/products?collection=..."
                                />
                            ) : (
                                <p className="text-sm text-gray-500 truncate">{item.link}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HandpickedManagement() {
    const [items, setItems] = useState<HandpickedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [editingSlot, setEditingSlot] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        subtitle: '',
        title: '',
        link: '',
        imageFile: null as File | null,
        imagePreview: ''
    })

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/handpicked?t=${Date.now()}`)
            const data = await response.json()
            if (data.success) {
                setItems(data.items)
            }
        } catch (error) {
            console.error('Error fetching handpicked items:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: HandpickedItem) => {
        setEditingSlot(item.slot)
        setFormData({
            subtitle: item.subtitle,
            title: item.title,
            link: item.link,
            imageFile: null,
            imagePreview: item.image
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, imageFile: file }))
            const url = URL.createObjectURL(file)
            setFormData(prev => ({ ...prev, imagePreview: url }))
        }
    }

    const handleSave = async (slot: string) => {
        try {
            setSaving(slot)
            const submitData = new FormData()
            submitData.append('slot', slot)
            submitData.append('subtitle', formData.subtitle)
            submitData.append('title', formData.title)
            submitData.append('link', formData.link)
            if (formData.imageFile) {
                submitData.append('image', formData.imageFile)
            }

            const response = await fetch('/api/handpicked', {
                method: 'POST',
                body: submitData
            })

            const data = await response.json()
            if (data.success) {
                setEditingSlot(null)
                fetchItems()
            } else {
                alert(data.error || 'Failed to save item')
            }
        } catch (error) {
            console.error('Error saving item:', error)
            alert('Error saving item')
        } finally {
            setSaving(null)
        }
    }

    const getSlotItem = (slot: string) => {
        return items.find(item => item.slot === slot) || {
            slot: slot as any,
            image: '',
            subtitle: slot === 'left' ? 'Statement' : slot === 'top-right' ? 'Lightweight' : 'Stylist',
            title: slot === 'left' ? 'NECKLACE SETS' : slot === 'top-right' ? 'JEWELLERY' : 'EARRINGS',
            link: '/products',
            isActive: true
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#510c74] mb-4" />
                <p className="text-gray-500">Loading collection data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#240334]">Signature Collection Management</h2>
                    <p className="text-gray-500 text-sm">Update the handpicked items shown on your home page.</p>
                </div>
            </div>

            <div className="space-y-6">
                <SlotCard
                    slot="left"
                    label="Left Large Slot (e.g., Necklace Sets)"
                    item={getSlotItem('left')}
                    isEditing={editingSlot === 'left'}
                    formData={formData}
                    setFormData={setFormData}
                    handleEdit={handleEdit}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    saving={saving}
                    setEditingSlot={setEditingSlot}
                />
                <SlotCard
                    slot="top-right"
                    label="Top Right Slot (e.g., Lightweight)"
                    item={getSlotItem('top-right')}
                    isEditing={editingSlot === 'top-right'}
                    formData={formData}
                    setFormData={setFormData}
                    handleEdit={handleEdit}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    saving={saving}
                    setEditingSlot={setEditingSlot}
                />
                <SlotCard
                    slot="bottom-right"
                    label="Bottom Right Slot (e.g., Earrings)"
                    item={getSlotItem('bottom-right')}
                    isEditing={editingSlot === 'bottom-right'}
                    formData={formData}
                    setFormData={setFormData}
                    handleEdit={handleEdit}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    saving={saving}
                    setEditingSlot={setEditingSlot}
                />
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h4 className="text-amber-800 font-bold mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" /> Design Tip
                </h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                    The signature collection now uses a simplified, elegant design.
                    The <strong>Main Title</strong> is positioned in the bottom-right corner of each card.
                    The border box and script subtitles have been removed to let your product images shine.
                    Use high-quality images with good contrast at the bottom right for the best visibility.
                </p>
            </div>
        </div>
    )
}
