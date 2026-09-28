# Mariyae Dashboard Setup Guide

## 🚀 Complete CRUD Operations with MongoDB & Cloudinary

The dashboard now includes full CRUD operations for products with MongoDB database integration and Cloudinary media storage.

## 📋 Features Implemented

### ✅ Product Management

- **Create Products**: Add new jewelry products with comprehensive details
- **Read Products**: View all products in a responsive table
- **Update Products**: Edit existing products with real-time updates
- **Delete Products**: Soft delete products (mark as inactive)

### ✅ Product Fields

- **Basic Info**: Name, Description, Category
- **Key Features**: Dynamic list of 1-7 key features
- **Pricing**: Current price, Original price (for sales), Offer percentage
- **Inventory**: Quantity available, Size constraints
- **Media**: Multiple images and videos per product
- **Metadata**: Rating, reviews, timestamps

### ✅ Media Management

- **Images**: JPG, PNG, WebP support with automatic optimization
- **Videos**: MP4, MOV, AVI support
- **Cloud Storage**: All media stored in Cloudinary with organized folders
- **Preview**: Real-time preview of selected media before upload

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mariyae?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. MongoDB Setup

1. Create a MongoDB Atlas account or use local MongoDB
2. Create a database named `mariyae`
3. The Product collection will be created automatically
4. Copy your connection string to `MONGODB_URI`

### 3. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to your environment variables

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## 🗄️ Database Schema

### Product Collection

```typescript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  keyFeatures: [String] (required),
  price: Number (required),
  originalPrice: Number (optional),
  offerPercentage: Number (auto-calculated),
  isOnSale: Boolean (auto-calculated),
  sizeConstraints: String (optional),
  quantity: Number (required),
  category: String (required, enum),
  images: [{
    url: String,
    publicId: String
  }],
  videos: [{
    url: String,
    publicId: String
  }],
  rating: Number (default: 0),
  reviews: Number (default: 0),
  isNew: Boolean (default: true),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Products

- `GET /api/products` - Fetch all active products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Fetch single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Soft delete product

### Media Upload

- **Images**: Automatically optimized to 800x800px with quality optimization
- **Videos**: Stored in original format with size limits
- **Organization**: Files stored in `mariyae/products/` folder

## 🎯 Usage

### Adding Products

1. Click "Add Product" button
2. Fill in all required fields
3. Add key features (minimum 1, can add up to 7)
4. Upload images and/or videos
5. Set pricing and inventory details
6. Submit form

### Editing Products

1. Click edit button on any product
2. Modify fields as needed
3. Add/remove media files
4. Update pricing and inventory
5. Save changes

### Managing Media

- **Add Media**: Drag & drop or click to upload
- **Remove Media**: Click X button on media preview
- **Replace Media**: Upload new files, old ones will be replaced
- **Preview**: See media before saving

## 🛡️ Security Features

- **Input Validation**: All fields validated before database operations
- **File Type Validation**: Only allowed image/video formats accepted
- **Size Limits**: Reasonable file size restrictions
- **Soft Delete**: Products marked inactive rather than permanently removed
- **Error Handling**: Comprehensive error messages and logging

## 📱 Responsive Design

- **Mobile First**: Optimized for all device sizes
- **Touch Friendly**: Easy to use on tablets and phones
- **Responsive Tables**: Horizontal scrolling on small screens
- **Modal Forms**: Full-screen forms on mobile devices

## 🚀 Performance Features

- **Lazy Loading**: Images load as needed
- **Optimized Queries**: Efficient MongoDB queries
- **Caching**: Database connection caching
- **Image Optimization**: Automatic Cloudinary transformations

## 🔄 Real-time Updates

- **Instant Feedback**: Form submission results shown immediately
- **Live Statistics**: Dashboard stats update in real-time
- **Media Preview**: See uploaded files before saving
- **Error Handling**: Immediate validation feedback

## 📊 Dashboard Statistics

- **Total Products**: Count of all active products
- **Total Stock**: Sum of all product quantities
- **Total Value**: Inventory value calculation
- **Categories**: Number of product categories
- **Media Count**: Images and videos per product

## 🎨 Customization

### Adding New Categories

Edit the `categories` array in `ProductForm.tsx` and `Dashboard.tsx`

### Modifying Fields

Update the Product model in `lib/models/Product.ts`

### Styling Changes

Modify Tailwind classes in components

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check connection string and network access
2. **Cloudinary Upload**: Verify API credentials and cloud name
3. **File Upload**: Check file size and format restrictions
4. **Form Validation**: Ensure all required fields are filled

### Debug Mode

Check browser console and server logs for detailed error messages

## 📈 Future Enhancements

- **Bulk Operations**: Import/export multiple products
- **Advanced Filtering**: Search and filter products
- **Analytics**: Sales and inventory analytics
- **User Management**: Admin user roles and permissions
- **Backup**: Automated database backups
- **API Rate Limiting**: Protect against abuse

---

**Ready to use!** Once you provide the MongoDB and Cloudinary credentials, the dashboard will be fully functional with complete CRUD operations. 🎉
