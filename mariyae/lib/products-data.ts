export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isSale: boolean
  description?: string
  stock?: number
}

export const allProducts: Product[] = [
  // Products from ProductGrid
  {
    id: 1,
    name: "Aaradhya Minimal Necklace Set",
    price: 1099.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Aaradhya+Necklace",
    category: "Necklaces",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: false,
    description: "Elegant minimal necklace set perfect for everyday wear",
    stock: 25
  },
  {
    id: 2,
    name: "Deviya Lakshmi Necklace Set",
    price: 1219.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Deviya+Lakshmi",
    category: "Necklaces",
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isSale: false,
    description: "Traditional Lakshmi necklace set with intricate designs",
    stock: 18
  },
  {
    id: 3,
    name: "Flower Coin Choker Set",
    price: 699.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Flower+Choker",
    category: "Necklaces",
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isSale: false,
    description: "Beautiful flower coin choker perfect for traditional occasions",
    stock: 32
  },
  {
    id: 4,
    name: "Rudrani R Necklace Set",
    price: 1299.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Rudrani+Necklace",
    category: "Necklaces",
    rating: 4.6,
    reviews: 203,
    isNew: true,
    isSale: false,
    description: "Exquisite Rudrani necklace set with premium craftsmanship",
    stock: 15
  },
  {
    id: 5,
    name: "Divine Gold Pendant",
    price: 899.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Divine+Gold",
    category: "Pendants",
    rating: 4.9,
    reviews: 87,
    isNew: true,
    isSale: false,
    description: "Divine gold pendant with spiritual significance",
    stock: 28
  },
  {
    id: 6,
    name: "Sacred Silver Ring",
    price: 599.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Sacred+Silver",
    category: "Rings",
    rating: 4.8,
    reviews: 145,
    isNew: true,
    isSale: false,
    description: "Sacred silver ring with traditional motifs",
    stock: 42
  },
  
  // Products from FeaturedProducts
  {
    id: 7,
    name: "Diamond Elegance Ring",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300&text=Diamond+Ring",
    category: "Rings",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: true,
    description: "Elegant diamond ring with premium cut stones",
    stock: 12
  },
  {
    id: 8,
    name: "Pearl Drop Earrings",
    price: 159.99,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Pearl+Earrings",
    category: "Earrings",
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isSale: false,
    description: "Classic pearl drop earrings for elegant occasions",
    stock: 35
  },
  {
    id: 9,
    name: "Gold Chain Necklace",
    price: 249.99,
    originalPrice: 329.99,
    image: "/placeholder.svg?height=300&width=300&text=Gold+Necklace",
    category: "Necklaces",
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isSale: true,
    description: "Premium gold chain necklace with discount",
    stock: 20
  },
  {
    id: 10,
    name: "Silver Charm Bracelet",
    price: 89.99,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Silver+Bracelet",
    category: "Bracelets",
    rating: 4.6,
    reviews: 203,
    isNew: false,
    isSale: false,
    description: "Delicate silver charm bracelet",
    stock: 48
  },
  
  // Additional products to make it more comprehensive
  {
    id: 11,
    name: "Royal Emerald Necklace",
    price: 2499.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Emerald+Necklace",
    category: "Necklaces",
    rating: 4.9,
    reviews: 67,
    isNew: true,
    isSale: false,
    description: "Luxurious emerald necklace with royal design",
    stock: 8
  },
  {
    id: 12,
    name: "Sapphire Stud Earrings",
    price: 799.00,
    originalPrice: 999.00,
    image: "/placeholder.svg?height=300&width=300&text=Sapphire+Earrings",
    category: "Earrings",
    rating: 4.7,
    reviews: 134,
    isNew: false,
    isSale: true,
    description: "Beautiful sapphire stud earrings with discount",
    stock: 22
  },
  {
    id: 13,
    name: "Platinum Wedding Band",
    price: 1899.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Platinum+Ring",
    category: "Rings",
    rating: 4.8,
    reviews: 89,
    isNew: true,
    isSale: false,
    description: "Elegant platinum wedding band",
    stock: 16
  },
  {
    id: 14,
    name: "Crystal Anklet",
    price: 399.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Crystal+Anklet",
    category: "Anklets",
    rating: 4.5,
    reviews: 78,
    isNew: false,
    isSale: false,
    description: "Delicate crystal anklet for summer",
    stock: 30
  },
  {
    id: 15,
    name: "Rose Gold Pendant",
    price: 649.00,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300&text=Rose+Gold+Pendant",
    category: "Pendants",
    rating: 4.6,
    reviews: 112,
    isNew: true,
    isSale: false,
    description: "Modern rose gold pendant design",
    stock: 25
  }
]

export const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants', 'Anklets']

export const getProductsByCategory = (category: string) => {
  return allProducts.filter(product => product.category === category)
}

export const getProductById = (id: number) => {
  return allProducts.find(product => product.id === id)
}

