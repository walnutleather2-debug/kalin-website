require('dotenv').config()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvonbsa8m',
  api_key: process.env.CLOUDINARY_API_KEY || '557391634658223',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'DMD_JDwOOBrRQYzp6jbdRRnVVYY'
})

// Define Product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  keyFeatures: [{ type: String }],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  offerPercentage: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  quantity: { type: Number, default: 50 },
  category: { type: String, required: true },
  mainCategory: { type: String, default: '' },
  subCategory: { type: String, default: '' },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: true }
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const demoProducts = [
  {
    name: "Mariyae Kalin Royal Artisan Necklace",
    description: "Exquisite handcrafted Kalin necklace featuring high-polish finish, intricate filigree detailing, and timeless elegance suited for celebrations and formal galas.",
    keyFeatures: ["Handcrafted detailing", "Anti-tarnish protective coating", "Hypoallergenic skin-friendly finish", "Signature Mariyae Kalin packaging"],
    price: 3499,
    originalPrice: 4999,
    offerPercentage: 30,
    isOnSale: true,
    category: "necklaces",
    mainCategory: "necklaces",
    subCategory: "traditional",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000"
  },
  {
    name: "Mariyae Kalin Solitaire Lumina Ring",
    description: "A breathtaking precision-cut ring that captures every ray of light. Designed for effortless glamour, everyday wear, and memorable gift-giving.",
    keyFeatures: ["Brilliant faceted cut", "Ergonomic comfort band", "Rust & moisture resistant", "Certified Kalin craftsmanship"],
    price: 1299,
    originalPrice: 1899,
    offerPercentage: 31,
    isOnSale: true,
    category: "rings",
    mainCategory: "rings",
    subCategory: "contemporary",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000"
  },
  {
    name: "Mariyae Kalin Heritage Chandbali Earrings",
    description: "Traditional Indian drop earrings crafted with fine faux pearls and ornate metalwork. Perfectly paired with festive sarees, lehengas, and contemporary fusion outfits.",
    keyFeatures: ["Lightweight hollow-core build", "Secure push-back closure", "Micro-pearl cluster embellishments", "Hand-finished edge"],
    price: 1899,
    originalPrice: 2499,
    offerPercentage: 24,
    isOnSale: false,
    category: "earrings",
    mainCategory: "earrings",
    subCategory: "chandbali",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000"
  },
  {
    name: "Mariyae Kalin Celestial Flora Pendant",
    description: "Subtle and sophisticated, this delicate floral pendant hangs gracefully from a matching chain, offering modern minimalist elegance for daily sophistication.",
    keyFeatures: ["Adjustable link chain included", "Subtle crystal center stone", "Durable lacquer coating", "Minimalist aesthetic"],
    price: 1499,
    originalPrice: 2199,
    offerPercentage: 32,
    isOnSale: true,
    category: "pendants",
    mainCategory: "pendants",
    subCategory: "floral",
    imageUrl: "https://images.unsplash.com/photo-1611591475850-252f9540b031?w=1000"
  },
  {
    name: "Mariyae Kalin Empress Cuff Bracelet",
    description: "An adjustable statement cuff bracelet adorned with traditional motifs and fine textures. A versatile accessory that elevates any formal or festive ensemble.",
    keyFeatures: ["Adjustable flexible fit", "Sturdy premium alloy base", "Smooth inner contour for comfort", "Polished reflective shine"],
    price: 2199,
    originalPrice: 2999,
    offerPercentage: 26,
    isOnSale: false,
    category: "bracelets",
    mainCategory: "bracelets",
    subCategory: "cuffs",
    imageUrl: "https://images.unsplash.com/photo-1611591475850-252f9540b031?w=1000"
  },
  {
    name: "Mariyae Kalin Imperial Bridal Choker Set",
    description: "An opulent multi-tier bridal set including choker necklace and matching statement earrings, designed for the modern bride who values heritage artistry.",
    keyFeatures: ["Includes matching earrings", "Rich gold-tone antique plating", "Double-knotted secure stringing", "Velvet gift box included"],
    price: 5499,
    originalPrice: 7999,
    offerPercentage: 31,
    isOnSale: true,
    category: "wedding",
    mainCategory: "wedding",
    subCategory: "bridal",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000"
  }
]

async function seed() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not set in .env')
    process.exit(1)
  }

  console.log('Connecting to MongoDB...')
  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB successfully!')

  console.log(`Starting Cloudinary upload and database seeding strictly in 'kalin/products'...`)

  for (const item of demoProducts) {
    console.log(`\nUploading image for: ${item.name}...`)
    try {
      const uploadRes = await cloudinary.uploader.upload(item.imageUrl, {
        folder: 'kalin/products',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      })

      console.log(`-> Cloudinary Upload OK: ${uploadRes.public_id} (${uploadRes.secure_url})`)

      const product = new Product({
        name: item.name,
        description: item.description,
        keyFeatures: item.keyFeatures,
        price: item.price,
        originalPrice: item.originalPrice,
        offerPercentage: item.offerPercentage,
        isOnSale: item.isOnSale,
        quantity: 50,
        category: item.category,
        mainCategory: item.mainCategory,
        subCategory: item.subCategory,
        images: [{
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id
        }],
        isActive: true,
        isFeatured: true
      })

      const saved = await product.save()
      console.log(`-> Saved to MongoDB with ID: ${saved._id}`)
    } catch (err) {
      console.error(`-> Error processing ${item.name}:`, err.message)
    }
  }

  console.log('\nAll demo Kalin products have been successfully uploaded to Cloudinary (kalin/products) and inserted into MongoDB!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seeding fatal error:', err)
  process.exit(1)
})
