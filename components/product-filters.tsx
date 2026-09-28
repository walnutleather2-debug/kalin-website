"use client"

import { useState, useEffect } from "react"
import { ChevronDown, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  colors: string[]
  sizes: string[]
  isNew: boolean
  isOnSale: boolean
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { products } = useProducts()
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    material: true,
    color: true,
    size: true,
    status: true,
  })

  // Get unique values from products for filter options
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean)
  const uniqueMaterials = [...new Set(products.map(p => p.category))].filter(Boolean) // Using category as material for now
  const maxPrice = Math.max(...products.map(p => p.price), 0)
  const minPrice = Math.min(...products.map(p => p.price), 0)

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFilter = (filterType: keyof FilterState, value: any) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    }
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = (filterType: keyof FilterState, value: string) => {
    if (filterType === 'categories' || filterType === 'materials' || filterType === 'colors' || filterType === 'sizes') {
      const currentArray = filters[filterType] as string[]
      const newFilters = {
        ...filters,
        [filterType]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
      onFiltersChange(newFilters)
    }
  }

  const clearAllFilters = () => {
    const newFilters: FilterState = {
      categories: [],
      priceRange: [0, maxPrice] as [number, number],
      materials: [],
      colors: [],
      sizes: [],
      isNew: false,
      isOnSale: false,
    }
    onFiltersChange(newFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++
    if (filters.materials.length > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.sizes.length > 0) count++
    if (filters.isNew) count++
    if (filters.isOnSale) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#C4A484]" />
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-[#C4A484] text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Category
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.category ? "rotate-180" : ""}`} />
        </button>
        {openSections.category && (
          <div className="space-y-2">
            {uniqueCategories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  className="mr-2 text-[#C4A484] focus:ring-[#C4A484]"
                  onChange={() => toggleArrayFilter('categories', category)}
                />
                <span className="text-gray-700">{category}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({products.filter(p => p.category === category).length})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Price Range (₹)
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
        </button>
        {openSections.price && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₹{filters.priceRange[0].toLocaleString()}</span>
              <span>₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={100}
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={100}
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-[#C4A484] focus:border-[#C4A484]"
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || maxPrice])}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-[#C4A484] focus:border-[#C4A484]"
                  placeholder="Max"
                />
              </div>
            </div>
            {/* Quick Price Ranges */}
            <div className="space-y-2">
              {[
                { label: "Under ₹1,000", range: [0, 1000] },
                { label: "₹1,000 - ₹5,000", range: [1000, 5000] },
                { label: "₹5,000 - ₹10,000", range: [5000, 10000] },
                { label: "₹10,000 - ₹25,000", range: [10000, 25000] },
                { label: "Over ₹25,000", range: [25000, maxPrice] },
              ].map((priceRange) => (
                <button
                  key={priceRange.label}
                  onClick={() => updateFilter('priceRange', priceRange.range)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    filters.priceRange[0] === priceRange.range[0] && filters.priceRange[1] === priceRange.range[1]
                      ? "bg-[#C4A484] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {priceRange.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("status")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Status
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.status ? "rotate-180" : ""}`} />
        </button>
        {openSections.status && (
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isNew}
                className="mr-2 text-[#C4A484] focus:ring-[#C4A484]"
                onChange={(e) => updateFilter('isNew', e.target.checked)}
              />
              <span className="text-gray-700">New Arrivals</span>
              <span className="ml-auto text-xs text-gray-500">
                ({products.filter(p => p.isNew).length})
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isOnSale}
                className="mr-2 text-[#C4A484] focus:ring-[#C4A484]"
                onChange={(e) => updateFilter('isOnSale', e.target.checked)}
              />
              <span className="text-gray-700">On Sale</span>
              <span className="ml-auto text-xs text-gray-500">
                ({products.filter(p => p.isOnSale).length})
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("material")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Material
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.material ? "rotate-180" : ""}`} />
        </button>
        {openSections.material && (
          <div className="space-y-2">
            {["Gold", "Silver", "Platinum", "Diamond", "Pearl", "Rose Gold"].map((material) => (
              <label key={material} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material)}
                  className="mr-2 text-[#C4A484] focus:ring-[#C4A484]"
                  onChange={() => toggleArrayFilter('materials', material)}
                />
                <span className="text-gray-700">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Color
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.color ? "rotate-180" : ""}`} />
        </button>
        {openSections.color && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: "Gold", color: "#FFD700" },
              { name: "Silver", color: "#C0C0C0" },
              { name: "Rose Gold", color: "#E8B4B8" },
              { name: "White", color: "#FFFFFF" },
              { name: "Black", color: "#000000" },
              { name: "Blue", color: "#0066CC" },
              { name: "Red", color: "#CC0000" },
              { name: "Green", color: "#00CC66" },
            ].map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={() => toggleArrayFilter('colors', colorOption.name)}
                className={`w-8 h-8 rounded-full border-2 ${
                  filters.colors.includes(colorOption.name) ? "border-[#C4A484]" : "border-gray-300"
                }`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Size
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.size ? "rotate-180" : ""}`} />
        </button>
        {openSections.size && (
          <div className="grid grid-cols-4 gap-2">
            {["XS", "S", "M", "L", "XL", "5", "6", "7", "8", "9", "10", "11"].map((size) => (
              <button
                key={size}
                onClick={() => toggleArrayFilter('sizes', size)}
                className={`px-3 py-2 text-sm border rounded ${
                  filters.sizes.includes(size)
                    ? "border-[#C4A484] bg-[#C4A484] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#C4A484]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Summary */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </p>
          <Button 
            onClick={clearAllFilters} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
