import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Banner from "@/lib/models/Banner"
import { COLLECTIONS } from "@/lib/collections"
import HomeClient from "@/components/home-client"

export const dynamic = 'force-dynamic' // Ensure we get fresh data

async function getInitialData() {
  await connectDB()

  // 1. Fetch Banners
  const bannersData = await Banner.find({ isActive: { $ne: false } }).sort({ order: 1 }).lean()

  // 2. Fetch Initial Products (limit to 12)
  const productsData = await Product.find({ isActive: { $ne: false } })
    .select('name price originalPrice offerPercentage isOnSale images category subCategory isNew rating reviews')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean()

  // 3. Fetch Main Categories
  const db = (await import('mongoose')).connection.db
  if (!db) throw new Error("DB connection failed")
  const catCollection = db.collection(COLLECTIONS.MAIN_CATEGORIES)
  const categoriesDataRaw = await catCollection.find({}).sort({ name: 1 }).toArray()

  const categoriesData = categoriesDataRaw.map(cat => ({
    id: cat._id.toString(),
    name: cat.name,
    image: cat.image || "",
    count: 0
  }))

  return {
    banners: JSON.parse(JSON.stringify(bannersData)),
    products: JSON.parse(JSON.stringify(productsData)),
    categories: JSON.parse(JSON.stringify(categoriesData))
  }
}

export default async function Home() {
  const { banners, products, categories } = await getInitialData()

  return (
    <HomeClient
      banners={banners}
      initialProducts={products}
      mainCategories={categories}
    />
  )
}
