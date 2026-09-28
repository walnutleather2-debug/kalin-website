import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  keyFeatures: [{
    type: String,
    required: [true, 'At least one key feature is required']
  }],
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  offerPercentage: {
    type: Number,
    min: [0, 'Offer percentage cannot be negative'],
    max: [100, 'Offer percentage cannot exceed 100%']
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  sizeConstraints: {
    type: String
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  mainCategory: {
    type: String,
    default: ''
  },
  subCategory: {
    type: String,
    default: ''
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
})

// Performance Indexes
ProductSchema.index({ isActive: 1, createdAt: -1 })
ProductSchema.index({ category: 1 })
ProductSchema.index({ subCategory: 1 })
ProductSchema.index({ mainCategory: 1 })

// Calculate offer percentage if original price is provided
ProductSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.offerPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
    this.isOnSale = true
  }
  next()
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)

