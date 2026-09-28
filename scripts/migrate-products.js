const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import the Product model
const Product = require('../lib/models/Product.js');

// All existing products from your website
const existingProducts = [
  {
    name: "Aaradhya Minimal Necklace Set",
    description: "Elegant minimal necklace set perfect for everyday wear. Features delicate craftsmanship and timeless design that complements any outfit.",
    keyFeatures: [
      "Minimalist design",
      "Everyday wear",
      "Delicate craftsmanship",
      "Timeless elegance",
      "Versatile styling"
    ],
    price: 1099.00,
    originalPrice: null,
    sizeConstraints: "Adjustable chain length 16-18 inches",
    quantity: 25,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Aaradhya+Necklace",
        publicId: "mariyae/products/aaradhya-necklace-1"
      }
    ],
    videos: [],
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isActive: true
  },
  {
    name: "Deviya Lakshmi Necklace Set",
    description: "Traditional Lakshmi necklace set with intricate detailing and auspicious symbols. Perfect for festivals and special occasions.",
    keyFeatures: [
      "Traditional design",
      "Lakshmi motifs",
      "Festival wear",
      "Intricate detailing",
      "Auspicious symbols"
    ],
    price: 1219.00,
    originalPrice: null,
    sizeConstraints: "Chain length 18 inches, Pendant size 2x1.5 inches",
    quantity: 18,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Deviya+Lakshmi",
        publicId: "mariyae/products/deviya-lakshmi-1"
      }
    ],
    videos: [],
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isActive: true
  },
  {
    name: "Flower Coin Choker Set",
    description: "Beautiful flower coin choker set with vintage appeal. Features floral patterns and coin embellishments for a unique look.",
    keyFeatures: [
      "Vintage design",
      "Flower patterns",
      "Coin embellishments",
      "Choker style",
      "Unique appeal"
    ],
    price: 699.00,
    originalPrice: null,
    sizeConstraints: "Choker length 14 inches, Adjustable",
    quantity: 32,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Flower+Choker",
        publicId: "mariyae/products/flower-choker-1"
      }
    ],
    videos: [],
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isActive: true
  },
  {
    name: "Rudrani R Necklace Set",
    description: "Elegant Rudrani necklace set with modern design elements. Perfect blend of traditional and contemporary styles.",
    keyFeatures: [
      "Modern design",
      "Traditional elements",
      "Contemporary style",
      "Elegant finish",
      "Versatile wear"
    ],
    price: 1299.00,
    originalPrice: null,
    sizeConstraints: "Chain length 20 inches, Pendant size 2.5x2 inches",
    quantity: 15,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Rudrani+Necklace",
        publicId: "mariyae/products/rudrani-necklace-1"
      }
    ],
    videos: [],
    rating: 4.6,
    reviews: 203,
    isNew: true,
    isActive: true
  },
  {
    name: "Divine Gold Pendant",
    description: "Exquisite gold pendant with divine motifs and spiritual significance. Handcrafted with attention to detail.",
    keyFeatures: [
      "Divine motifs",
      "Spiritual significance",
      "Handcrafted",
      "Gold finish",
      "Detailed work"
    ],
    price: 899.00,
    originalPrice: null,
    sizeConstraints: "Pendant size 1.8x1.2 inches, Chain length 18 inches",
    quantity: 28,
    category: "Pendants",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Divine+Gold",
        publicId: "mariyae/products/divine-gold-1"
      }
    ],
    videos: [],
    rating: 4.9,
    reviews: 87,
    isNew: true,
    isActive: true
  },
  {
    name: "Sacred Silver Ring",
    description: "Beautiful silver ring with sacred symbols and spiritual energy. Perfect for daily wear and meditation.",
    keyFeatures: [
      "Sacred symbols",
      "Spiritual energy",
      "Daily wear",
      "Meditation friendly",
      "Silver finish"
    ],
    price: 599.00,
    originalPrice: null,
    sizeConstraints: "Available in sizes 6-12, Adjustable",
    quantity: 45,
    category: "Rings",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Sacred+Silver",
        publicId: "mariyae/products/sacred-silver-1"
      }
    ],
    videos: [],
    rating: 4.8,
    reviews: 145,
    isNew: true,
    isActive: true
  },
  {
    name: "Diamond Elegance Ring",
    description: "Stunning diamond ring with elegant design and premium quality. Perfect for special occasions and celebrations.",
    keyFeatures: [
      "Diamond center",
      "Premium quality",
      "Elegant design",
      "Special occasions",
      "Celebration wear"
    ],
    price: 299.99,
    originalPrice: 399.99,
    sizeConstraints: "Available in sizes 5-11, Half sizes available",
    quantity: 12,
    category: "Rings",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Diamond+Ring",
        publicId: "mariyae/products/diamond-ring-1"
      }
    ],
    videos: [],
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isActive: true
  },
  {
    name: "Pearl Drop Earrings",
    description: "Classic pearl drop earrings with timeless beauty. Perfect for both casual and formal occasions.",
    keyFeatures: [
      "Pearl drops",
      "Timeless beauty",
      "Casual wear",
      "Formal occasions",
      "Classic design"
    ],
    price: 159.99,
    originalPrice: null,
    sizeConstraints: "Drop length 1.5 inches, Lightweight",
    quantity: 38,
    category: "Earrings",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Pearl+Earrings",
        publicId: "mariyae/products/pearl-earrings-1"
      }
    ],
    videos: [],
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isActive: true
  },
  {
    name: "Gold Chain Necklace",
    description: "Elegant gold chain necklace with premium finish. Versatile design that goes with any outfit.",
    keyFeatures: [
      "Gold finish",
      "Premium quality",
      "Versatile design",
      "Any outfit",
      "Elegant style"
    ],
    price: 249.99,
    originalPrice: 329.99,
    sizeConstraints: "Chain length 18 inches, Adjustable clasp",
    quantity: 22,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Gold+Necklace",
        publicId: "mariyae/products/gold-necklace-1"
      }
    ],
    videos: [],
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isActive: true
  },
  {
    name: "Silver Charm Bracelet",
    description: "Delicate silver charm bracelet with meaningful symbols. Perfect for gifting and personal wear.",
    keyFeatures: [
      "Silver finish",
      "Meaningful symbols",
      "Perfect gifting",
      "Personal wear",
      "Delicate design"
    ],
    price: 89.99,
    originalPrice: null,
    sizeConstraints: "Bracelet length 7.5 inches, Adjustable",
    quantity: 55,
    category: "Bracelets",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Silver+Bracelet",
        publicId: "mariyae/products/silver-bracelet-1"
      }
    ],
    videos: [],
    rating: 4.6,
    reviews: 203,
    isNew: false,
    isActive: true
  },
  {
    name: "Emerald Stone Ring",
    description: "Beautiful emerald stone ring with vintage charm. Features a stunning emerald center stone with intricate setting.",
    keyFeatures: [
      "Emerald center",
      "Vintage charm",
      "Intricate setting",
      "Stunning stone",
      "Unique design"
    ],
    price: 799.00,
    originalPrice: null,
    sizeConstraints: "Available in sizes 6-10, Stone size 8x6mm",
    quantity: 8,
    category: "Rings",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Emerald+Ring",
        publicId: "mariyae/products/emerald-ring-1"
      }
    ],
    videos: [],
    rating: 4.9,
    reviews: 67,
    isNew: true,
    isActive: true
  },
  {
    name: "Crystal Stud Earrings",
    description: "Sparkling crystal stud earrings with brilliant shine. Perfect for adding glamour to any look.",
    keyFeatures: [
      "Crystal studs",
      "Brilliant shine",
      "Adds glamour",
      "Versatile wear",
      "Sparkling effect"
    ],
    price: 129.00,
    originalPrice: null,
    sizeConstraints: "Stud size 6mm, Lightweight design",
    quantity: 42,
    category: "Earrings",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Crystal+Studs",
        publicId: "mariyae/products/crystal-studs-1"
      }
    ],
    videos: [],
    rating: 4.7,
    reviews: 98,
    isNew: false,
    isActive: true
  },
  {
    name: "Rose Gold Anklet",
    description: "Elegant rose gold anklet with delicate chain design. Perfect for summer and beach wear.",
    keyFeatures: [
      "Rose gold finish",
      "Delicate chain",
      "Summer wear",
      "Beach friendly",
      "Elegant design"
    ],
    price: 349.00,
    originalPrice: null,
    sizeConstraints: "Anklet length 10 inches, Adjustable",
    quantity: 19,
    category: "Anklets",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Rose+Gold+Anklet",
        publicId: "mariyae/products/rose-gold-anklet-1"
      }
    ],
    videos: [],
    rating: 4.8,
    reviews: 76,
    isNew: true,
    isActive: true
  },
  {
    name: "Temple Jewelry Set",
    description: "Traditional temple jewelry set with religious significance. Perfect for temple visits and spiritual ceremonies.",
    keyFeatures: [
      "Traditional design",
      "Religious significance",
      "Temple visits",
      "Spiritual ceremonies",
      "Cultural heritage"
    ],
    price: 1899.00,
    originalPrice: null,
    sizeConstraints: "Set includes necklace, earrings, and bangles",
    quantity: 6,
    category: "Necklaces",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Temple+Jewelry",
        publicId: "mariyae/products/temple-jewelry-1"
      }
    ],
    videos: [],
    rating: 4.9,
    reviews: 34,
    isNew: true,
    isActive: true
  },
  {
    name: "Modern Geometric Pendant",
    description: "Contemporary geometric pendant with modern aesthetics. Perfect for fashion-forward individuals.",
    keyFeatures: [
      "Contemporary design",
      "Geometric shapes",
      "Modern aesthetics",
      "Fashion forward",
      "Unique style"
    ],
    price: 459.00,
    originalPrice: null,
    sizeConstraints: "Pendant size 2x1.5 inches, Chain length 18 inches",
    quantity: 31,
    category: "Pendants",
    images: [
      {
        url: "/placeholder.svg?height=300&width=300&text=Geometric+Pendant",
        publicId: "mariyae/products/geometric-pendant-1"
      }
    ],
    videos: [],
    rating: 4.6,
    reviews: 112,
    isNew: false,
    isActive: true
  }
];

async function migrateProducts() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing products (optional - remove this if you want to keep existing ones)
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑️  Clearing ${existingCount} existing products...`);
      await Product.deleteMany({});
      console.log('✅ Existing products cleared');
    }

    // Insert all products
    console.log(`📦 Inserting ${existingProducts.length} products...`);
    const result = await Product.insertMany(existingProducts);
    
    console.log(`✅ Successfully migrated ${result.length} products to MongoDB!`);
    console.log('\n📊 Migration Summary:');
    console.log(`   • Total Products: ${result.length}`);
    
    // Count by category
    const categoryCounts = {};
    result.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    console.log('   • By Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`     - ${category}: ${count}`);
    });

    // Show some sample products
    console.log('\n🎯 Sample Products:');
    result.slice(0, 3).forEach(product => {
      console.log(`   • ${product.name} - ₹${product.price} (${product.category})`);
    });

    console.log('\n🚀 Migration completed successfully!');
    console.log('💡 You can now view these products in your dashboard at /dashboard');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateProducts();
