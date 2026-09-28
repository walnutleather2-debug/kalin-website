# Environment Variables Setup - Mariyae E-commerce

## 📋 Quick Setup Guide

### Step 1: Create `.env.local` file

Copy the example file:
```bash
cp .env.example .env.local
```

### Step 2: Update with Your Credentials

Open `.env.local` and update the following:

#### MongoDB Configuration
```env
MONGODB_URI=your_new_mongodb_connection_string
MONGODB_DB=mariyae
```

#### Cloudinary Configuration
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:** All Cloudinary data will be saved in the `mariyae-com/` folder structure:
- Products: `mariyae-com/products/`
- Categories: `mariyae-com/categories/{category}/`
- Banners: `mariyae-com/banners/`
- Thumbnails: `mariyae-com/thumbnails/`

### Step 3: Restart Server

After updating credentials:
```bash
npm run dev
```

## 🔧 Configuration Details

### MongoDB
- **Database Name:** `mariyae` (or as specified in `MONGODB_DB`)
- **Collections:** 
  - `products` - Product catalog
  - `orders` - Customer orders
  - `users` - User accounts
  - `main_categories` - Main categories (Jewellery, Hijabs, Leather Bags)
  - `sub_categories` - Subcategories

### Cloudinary
- **Base Folder:** `mariyae-com/`
- **Organization:** All media organized by type and category
- **Supported Formats:**
  - Images: JPG, JPEG, PNG, WebP
  - Videos: MP4, MOV, AVI, MKV

## 📝 Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Folder Structure:** All Cloudinary uploads use `mariyae-com/` prefix
3. **Demo Data:** After setup, demo products will be available in the dashboard
4. **Verification:** Check Cloudinary console to verify folder structure after first upload

## 🚀 After Setup

1. Verify MongoDB connection in dashboard
2. Upload a test product to verify Cloudinary integration
3. Check Cloudinary console for `mariyae-com/` folder structure
4. Demo data will be available for testing



