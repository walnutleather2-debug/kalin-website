import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
})

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true })
UserSchema.set('toObject', { virtuals: true })

// Index for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

export default mongoose.models.User || mongoose.model('User', UserSchema)
