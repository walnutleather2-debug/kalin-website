import mongoose, { Schema, Document } from 'mongoose'

export interface IHandpicked extends Document {
    slot: 'left' | 'top-right' | 'bottom-right'
    image: string
    subtitle: string
    title: string
    link: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const HandpickedSchema: Schema = new Schema({
    slot: {
        type: String,
        required: [true, 'Slot is required'],
        enum: ['left', 'top-right', 'bottom-right'],
        unique: true
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    subtitle: {
        type: String,
        trim: true,
        required: [true, 'Subtitle is required']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required']
    },
    link: {
        type: String,
        trim: true,
        default: '/products'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Force refresh model in development
if (mongoose.models.Handpicked) {
    delete mongoose.models.Handpicked
}

export default mongoose.model<IHandpicked>('Handpicked', HandpickedSchema)
