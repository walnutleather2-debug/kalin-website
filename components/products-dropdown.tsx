"use client";

import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

const categories = [
    {
        name: "Necklace",
        href: "/category/necklace",
        subCategory: "Elegant necklaces for every occasion",
      },
      {
        name: "Anti Tarnish Jewelry",
        href: "/category/anti-tarnish-jewelry",
        subCategory: "Long-lasting jewelry that resists tarnishing",
      },
      {
        name: "Earrings",
        href: "/category/earrings",
        subCategory: "Beautiful earrings to complement your style",
      },
      {
        name: "Bracelets",
        href: "/category/bracelets",
        subCategory: "Stylish bracelets for wrist adornment",
      },
      {
        name: "Ring",
        href: "/category/ring",
        subCategory: "Exquisite rings for fingers",
      },
      {
        name: "Mangalsutra",
        href: "/category/mangalsutra",
        subCategory: "Sacred mangalsutra for married women",
      },
      {
        name: "Bangles",
        href: "/category/bangles",
        subCategory: "Traditional bangles for cultural occasions",
      },
      {
        name: "Pendant Set",
        href: "/category/pendant-set",
        subCategory: "Complete pendant sets with chains",
      },
      {
        name: "Nose Pin",
        href: "/category/nose-pin",
        subCategory: "Elegant nose pins for traditional look",
      },
      {
        name: "Maang Tika",
        href: "/category/maang-tika",
        subCategory: "Traditional maang tika for special occasions",
      },
    ];

const ProductsDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);



  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => {
        setShowDropdown(false);
        setHoveredCategory(null);
      }}
    >
             {/* Products Tab */}
               <button className="px-4 py-2 text-sm text-black hover:text-gray-700 flex items-center gap-1 font-medium">
          Products
          <FiChevronDown />
        </button>

             {/* Category Dropdown */}
       {showDropdown && (
         <div className="absolute top-full right-0 mt-2 z-50">
           {/* Categories Grid */}
           <div className="w-[600px] bg-white border rounded shadow-md p-4">
                           <div className="grid grid-cols-4 gap-1">
               {categories.map((cat, idx) => (
                 <div
                   key={idx}
                   onMouseEnter={() => setHoveredCategory(cat.name)}
                   onMouseLeave={() => setHoveredCategory(null)}
                   className="relative"
                 >
                   <Link
                     href={cat.href}
                                           className="block px-2 py-1 text-xs text-gray-800 hover:bg-gray-100 rounded transition-colors"
                   >
                     {cat.name}
                   </Link>
                   
                   {/* Subcategory Panel - appears on the left */}
                   {hoveredCategory === cat.name && (
                     <div className="absolute right-full top-0 mr-2 w-48 bg-white border rounded shadow-md p-3">
                       <p className="text-xs text-gray-700 font-medium">
                         {cat.subCategory}
                       </p>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default ProductsDropdown;
