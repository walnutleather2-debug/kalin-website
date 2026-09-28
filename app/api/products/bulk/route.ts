import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { products } = body

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No products provided' },
                { status: 400 }
            )
        }

        const results = {
            created: 0,
            failed: 0,
            errors: [] as Array<{ index: number; error: string }>
        }

        // Process products in batches to avoid overwhelming the database
        const batchSize = 10
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize)

            await Promise.all(
                batch.map(async (productData, batchIndex) => {
                    const actualIndex = i + batchIndex
                    try {
                        // Transform image and video URLs to the format expected by the Product model
                        const images = productData.images.map((url: string) => ({
                            url,
                            publicId: extractPublicIdFromUrl(url)
                        }))

                        const videos = productData.videos?.map((url: string) => ({
                            url,
                            publicId: extractPublicIdFromUrl(url)
                        })) || []

                        // Create product document
                        const product = new Product({
                            name: productData.name,
                            description: productData.description,
                            keyFeatures: productData.keyFeatures,
                            price: productData.price,
                            originalPrice: productData.originalPrice,
                            category: productData.category,
                            subCategory: productData.subCategory,
                            mainCategory: productData.mainCategory,
                            images,
                            videos,
                            quantity: productData.quantity,
                            sku: productData.sku,
                            isNew: productData.isNew || false,
                            isOnSale: productData.isOnSale || false,
                            offerPercentage: productData.offerPercentage || 0
                        })

                        await product.save()
                        results.created++
                    } catch (error) {
                        results.failed++
                        results.errors.push({
                            index: actualIndex + 1,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        })
                    }
                })
            )
        }

        return NextResponse.json({
            success: results.failed === 0,
            created: results.created,
            failed: results.failed,
            errors: results.errors.length > 0 ? results.errors : undefined
        })
    } catch (error) {
        console.error('Bulk upload error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to process bulk upload',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

/**
 * Extract Cloudinary public ID from URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 * Returns: v1234567890/sample
 */
function extractPublicIdFromUrl(url: string): string {
    try {
        const match = url.match(/\/upload\/(.+)$/)
        if (match && match[1]) {
            // Remove file extension
            return match[1].replace(/\.[^.]+$/, '')
        }
        return url
    } catch {
        return url
    }
}
