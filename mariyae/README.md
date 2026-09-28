# Mariyae - E-commerce Jewelry Website

A modern, responsive e-commerce platform built with Next.js, TypeScript, and Tailwind CSS, designed specifically for jewelry retail.

## 🚀 Features

### Core E-commerce Functionality
- **Shopping Cart System**: Full cart management with add/remove items, quantity updates, and persistent storage
- **Product Catalog**: Comprehensive product listings with categories, filters, and search
- **Checkout Process**: Multi-step checkout with shipping and payment options
- **Order Management**: Track orders, view order history, and manage account details
- **User Accounts**: Profile management, order history, and preferences

### Product Features
- **Product Grid/List Views**: Toggle between grid and list layouts
- **Advanced Filtering**: Filter by category, brand, price range, and more
- **Search Functionality**: Full-text search across products with filters
- **Product Categories**: Organized jewelry categories (Rings, Necklaces, Earrings, etc.)
- **Product Details**: Comprehensive product information with images and descriptions

### Shopping Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Cart Icon**: Real-time cart count and quick cart preview
- **Wishlist**: Save favorite items for later
- **Product Carousels**: Featured products and new arrivals with navigation

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Context API**: State management for cart and user data
- **Local Storage**: Persistent cart data across sessions
- **Component Library**: Reusable UI components with shadcn/ui
- **Tailwind CSS**: Utility-first CSS framework for rapid development

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Build Tool**: Next.js App Router

## 📁 Project Structure

```
Mariyae/
├── app/                          # Next.js app directory
50: │   ├── account/                  # User account management
51: │   ├── cart/                     # Shopping cart page
52: │   ├── checkout/                 # Checkout process
53: │   │   └── success/             # Order confirmation
54: │   ├── products/                 # Product listings
55: │   │   └── [id]/                # Individual product pages
56: │   ├── search/                   # Search results page
57: │   ├── shop/                     # Shop page with filters
58: │   └── layout.tsx               # Root layout with cart provider
59: ├── components/                   # Reusable components
60: │   ├── ui/                      # shadcn/ui components
61: │   ├── cart-icon.tsx            # Shopping cart icon
62: │   ├── navbar.tsx               # Navigation bar
63: │   ├── product-grid.tsx         # Product display grid
64: │   └── footer.tsx               # Site footer
65: ├── contexts/                     # React contexts
66: │   └── cart-context.tsx         # Shopping cart state management
67: ├── hooks/                        # Custom React hooks
68: ├── lib/                          # Utility functions
69: └── public/                       # Static assets
70: ```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB URI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mariyae
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛍️ E-commerce Features Walkthrough

### 1. Shopping Cart
- **Add to Cart**: Click "Add to Cart" buttons on any product
- **Cart Icon**: View cart count and quick preview in the navbar
- **Cart Page**: Full cart management at `/cart`
- **Persistent Storage**: Cart data saved in localStorage

### 2. Product Browsing
- **Homepage**: Featured products and new arrivals
- **Shop Page**: All products with category filters
- **Product Details**: Individual product pages with full information
- **Search**: Search products by name, category, or brand

### 3. Checkout Process
- **Cart Review**: Review items before checkout
- **Shipping Information**: Enter delivery address
- **Payment Method**: Choose payment option (Card, UPI, COD)
- **Order Confirmation**: Success page with order details

### 4. User Account
- **Profile Management**: Update personal information
- **Order History**: View past orders and track current ones
- **Wishlist**: Save favorite products
- **Account Settings**: Manage preferences and security

## 🎨 Customization

### Styling
- **Colors**: Update color scheme in `tailwind.config.ts`
- **Fonts**: Customize fonts in `app/layout.tsx`
- **Components**: Modify UI components in `components/ui/`

### Content
- **Products**: Update product data in component files
- **Categories**: Modify category lists in filter components
- **Branding**: Update company information in footer and navbar

### Features
- **Payment Integration**: Add real payment gateways
- **Inventory Management**: Connect to backend inventory system
- **User Authentication**: Implement real user login system
- **Order Processing**: Add backend order management

## 🔧 Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Structure
- **Components**: Reusable UI components in `components/`
- **Pages**: Route pages in `app/` directory
- **Contexts**: State management in `contexts/`
- **Types**: TypeScript interfaces and types

### Adding New Features
1. Create new components in `components/`
2. Add new routes in `app/` directory
3. Update navigation in `components/navbar.tsx`
4. Add to cart context if needed

## 📱 Responsive Design

The website is fully responsive with:
- **Mobile-first approach**
- **Breakpoint-specific layouts**
- **Touch-friendly interactions**
- **Optimized for all screen sizes**

## 🚀 Deployment

### Build for Production
```bash
pnpm build
pnpm start
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js
3. Deploy with zero configuration

### Environment Variables
Create `.env.local` for local development:
```env
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@mariyae.com
- Phone: +91 7045932672
- Business Hours: Mon-Sat 9AM-8PM

## 🔮 Future Enhancements

- **Real-time Inventory**: Live stock updates
- **Advanced Analytics**: Customer behavior tracking
- **Multi-language Support**: Internationalization
- **AR Try-on**: Virtual jewelry fitting
- **Loyalty Program**: Customer rewards system
- **Mobile App**: Native mobile application

---

**Mariyae** - Crafting timeless jewelry pieces that celebrate life's most precious moments. ✨
