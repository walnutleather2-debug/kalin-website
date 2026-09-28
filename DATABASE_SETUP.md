# Database Setup Instructions

## Quick Fix for the "Failed to create order" Error

The error you're seeing is because the application can't connect to MongoDB. Here's how to fix it:

### Option 1: Set up MongoDB (Recommended)

1. **Create a `.env.local` file** in the root directory (`Mariyae/` folder)

2. **Add your MongoDB connection string** to the file:

   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mariyae?retryWrites=true&w=majority
   ```

3. **Get MongoDB connection string:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
   - Create a new cluster
   - Click "Connect" and choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `mariyae`

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Option 2: Use Local MongoDB

If you have MongoDB installed locally:

1. **Create `.env.local` file:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/mariyae
   ```

2. **Start local MongoDB service**

### Option 3: Demo Mode (Current)

The application now works in demo mode without a database:

- ✅ Checkout process works
- ✅ Orders are created (but not stored)
- ✅ Success page shows
- ❌ Dashboard shows "Database Connection Required"

## What Happens After Setup

Once MongoDB is connected:

- ✅ Orders will be saved to database
- ✅ Dashboard will show real orders
- ✅ Admin can manage order statuses
- ✅ Complete order management system

## Testing the Setup

1. **Check connection:** Look for any error messages in the dashboard
2. **Try checkout:** Place an order and see if it appears in the dashboard
3. **Check console:** No more "Failed to create order" errors

## Need Help?

- Check the browser console for detailed error messages
- Verify your MongoDB connection string format
- Make sure your MongoDB cluster allows connections from your IP
- Check if the database name `mariyae` exists

## Current Status

- **Checkout:** ✅ Working (demo mode)
- **Database:** ❌ Not connected
- **Dashboard:** ⚠️ Shows setup instructions
- **Orders:** ❌ Not persistent

Fix the database connection to unlock the full order management system!
