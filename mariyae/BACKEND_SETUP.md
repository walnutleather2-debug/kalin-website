# Environment Setup Guide for Mariyae E-commerce Backend

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mariyae

# Cloudinary Configuration (for image/video storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Setup Instructions

### 1. MongoDB Setup

- Install MongoDB locally or use MongoDB Atlas
- For local MongoDB: `mongodb://localhost:27017/mariyae`
- For MongoDB Atlas: Use the connection string from your cluster

### 2. Cloudinary Setup

- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your Cloud Name, API Key, and API Secret from the dashboard
- Images and videos will be stored in organized folders:
  - Products: `mariyae/products/`
  - Categories: `mariyae/categories/{category}/`

### 3. JWT Secret

- Generate a secure random string for JWT_SECRET
- Use at least 32 characters
- Example: `openssl rand -base64 32`

## Backend Features Implemented

### ✅ Product Management

- **Create**: Add products with images/videos to Cloudinary
- **Read**: Fetch all products or individual product
- **Update**: Edit product details and manage media
- **Delete**: Remove products and clean up Cloudinary files

### ✅ Order Management

- **Create**: Place orders with customer details
- **Read**: Fetch orders with filtering and search
- **Update**: Update order status, payment status, tracking
- **Delete**: Remove pending orders

### ✅ User Authentication

- **Register**: Create new user accounts
- **Login**: Authenticate users with JWT tokens
- **Profile**: Get current user information
- **Update**: Update user profile details

### ✅ Database Models

- **Product**: Complete product schema with validation
- **Order**: Comprehensive order management
- **User**: User account and profile management

### ✅ API Endpoints

- `/api/products` - Product CRUD operations
- `/api/products/[id]` - Individual product operations
- `/api/orders` - Order management
- `/api/orders/[id]` - Individual order operations
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user
- `/api/auth/logout` - User logout

### ✅ Frontend Integration

- **Dashboard**: Admin panel for product/order management
- **Account Page**: User order history and profile management
- **Hooks**: useProducts, useOrders for API integration

## File Structure

```
Mariyae/
├── app/api/
│   ├── products/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   ├── orders/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   └── auth/
│       ├── register/route.ts
│       ├── login/route.ts
│       ├── me/route.ts
│       └── logout/route.ts
├── lib/
│   ├── models/
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── User.ts
│   ├── mongodb.ts
│   └── cloudinary.ts
├── hooks/
│   ├── useProducts.ts
│   └── useOrders.ts
├── components/
│   ├── ProductForm.tsx
│   └── OrderDetailModal.tsx
```

## Ready for Production

The backend is now ready for production deployment. Make sure to:

1. Set up your MongoDB database
2. Configure Cloudinary account
3. Set secure environment variables
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

All text data is stored in MongoDB and media files are stored in Cloudinary with organized folder structure.
