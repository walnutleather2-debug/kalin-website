"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function ShopFilters() {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    material: true,
    color: true,
  })



  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Filters</h2>

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
            {["Rings", "Earrings", "Necklaces", "Bracelets", "Watches"].map((category) => (
              <label key={category} className="flex items-center">
                <input type="checkbox" className="mr-2 text-[#C4A484] focus:ring-[#C4A484]" />
                <span className="text-gray-700">{category}</span>
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
          Price Range
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
        </button>
        {openSections.price && (
          <div className="space-y-2">
            {["Under $100", "$100 - $200", "$200 - $500", "$500 - $1000", "Over $1000"].map((range) => (
              <label key={range} className="flex items-center">
                <input type="checkbox" className="mr-2 text-[#C4A484] focus:ring-[#C4A484]" />
                <span className="text-gray-700">{range}</span>
              </label>
            ))}
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
            {["Gold", "Silver", "Platinum", "Diamond", "Pearl"].map((material) => (
              <label key={material} className="flex items-center">
                <input type="checkbox" className="mr-2 text-[#C4A484] focus:ring-[#C4A484]" />
                <span className="text-gray-700">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
