import { MongoClient, Db } from 'mongodb'
import dns from 'dns'

// Ensure reliable SRV resolution on Windows for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (e) {
  // Ignore in environments where custom DNS servers cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'mariyae'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached: { client: MongoClient | null; db: Db | null } = { client: null, db: null }

export async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db }
  }

  const client = new MongoClient(MONGODB_URI as string)
  await client.connect()

  const db = client.db(MONGODB_DB)

  cached.client = client
  cached.db = db

  return { client, db }
}
