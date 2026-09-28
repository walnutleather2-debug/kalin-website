import mongoose, { Schema, Document } from 'mongoose'

export interface IBanner extends Document {
    order: number
    eyebrowText?: string
    headline?: string
    description?: string
    button1Text?: string
    button1Link?: string
    button2Text?: string
    button2Link?: string
    layoutType: 'normal' | 'reversed'
    backgroundImage: string
    decorativeImage?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const BannerSchema: Schema = new Schema({
    order: {
        type: Number,
        default: 0
    },
    eyebrowText: {
        type: String,
        trim: true
    },
    headline: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    button1Text: {
        type: String,
        trim: true
    },
    button1Link: {
        type: String,
        trim: true
    },
    button2Text: {
        type: String,
        trim: true
    },
    button2Link: {
        type: String,
        trim: true
    },
    layoutType: {
        type: String,
        enum: ['normal', 'reversed'],
        default: 'normal'
    },
    backgroundImage: {
        type: String,
        required: [true, 'Background image is required']
    },
    decorativeImage: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Force delete existing model to apply schema changes
if (mongoose.models.Banner) {
    delete mongoose.models.Banner
}
export default mongoose.model<IBanner>('Banner', BannerSchema)
