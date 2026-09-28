import * as XLSX from 'xlsx'

export interface ProductData {
    name: string
    description: string
    keyFeatures: string[]
    price: number
    originalPrice?: number
    category: string
    subCategory?: string
    mainCategory?: string
    images: string[]
    videos?: string[]
    quantity: number
    sku?: string
    isNew?: boolean
    isOnSale?: boolean
    offerPercentage?: number
}

export interface ValidationResult {
    valid: boolean
    errors: string[]
}

export interface ParseResult {
    success: boolean
    products: ProductData[]
    errors: Array<{ row: number; error: string }>
}

/**
 * Validate if a URL is a valid Cloudinary URL
 */
export function validateCloudinaryUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false

    const cloudinaryPattern = /^https?:\/\/res\.cloudinary\.com\/[^\/]+\/(image|video)\/upload\/.+/
    return cloudinaryPattern.test(url.trim())
}

/**
 * Parse boolean values from Excel
 */
function parseBoolean(value: any): boolean | undefined {
    if (value === undefined || value === null || value === '') return undefined

    const str = String(value).toLowerCase().trim()
    if (str === 'true' || str === '1' || str === 'yes') return true
    if (str === 'false' || str === '0' || str === 'no') return false

    return undefined
}

/**
 * Parse comma-separated strings into array
 */
function parseCommaSeparated(value: any): string[] {
    if (!value) return []

    return String(value)
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
}

/**
 * Validate product data
 */
export function validateProductData(data: ProductData, rowNumber: number): ValidationResult {
    const errors: string[] = []

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
        errors.push(`Row ${rowNumber}: Product name is required`)
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.push(`Row ${rowNumber}: Description is required`)
    }

    if (!data.keyFeatures || data.keyFeatures.length === 0) {
        errors.push(`Row ${rowNumber}: At least one key feature is required (comma-separated if multiple)`)
    }

    if (!data.price || isNaN(data.price) || data.price <= 0) {
        errors.push(`Row ${rowNumber}: Valid price is required`)
    }

    if (!data.category || data.category.trim().length === 0) {
        errors.push(`Row ${rowNumber}: Category is required`)
    }

    // Check quantity (using quantity instead of stock for model consistency)
    if (data.quantity === undefined || isNaN(data.quantity) || data.quantity < 0) {
        errors.push(`Row ${rowNumber}: Valid quantity (stock) is required`)
    }

    if (!data.images || data.images.length === 0) {
        errors.push(`Row ${rowNumber}: At least one image URL is required`)
    } else {
        // Validate all image URLs
        data.images.forEach((url, index) => {
            if (!validateCloudinaryUrl(url)) {
                errors.push(`Row ${rowNumber}: Invalid Cloudinary image URL at position ${index + 1}`)
            }
        })
    }

    // Validate video URLs if present
    if (data.videos && data.videos.length > 0) {
        data.videos.forEach((url, index) => {
            if (!validateCloudinaryUrl(url)) {
                errors.push(`Row ${rowNumber}: Invalid Cloudinary video URL at position ${index + 1}`)
            }
        })
    }

    // Validate optional fields
    if (data.originalPrice !== undefined && (isNaN(data.originalPrice) || data.originalPrice < 0)) {
        errors.push(`Row ${rowNumber}: Original price must be a valid number`)
    }

    if (data.offerPercentage !== undefined && (isNaN(data.offerPercentage) || data.offerPercentage < 0 || data.offerPercentage > 100)) {
        errors.push(`Row ${rowNumber}: Offer percentage must be between 0 and 100`)
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * Parse Excel file and extract product data
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
    try {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON with raw headers
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false })

        if (rawData.length === 0) {
            return {
                success: false,
                products: [],
                errors: [{ row: 0, error: 'Excel file is empty or has no data rows' }]
            }
        }

        const products: ProductData[] = []
        const errors: Array<{ row: number; error: string }> = []

        // Helper function to get value from row with case-insensitive and trimmed key matching
        const getValue = (row: any, key: string, fallbackKeys: string[] = []): any => {
            // Try exact match first
            if (row[key] !== undefined && row[key] !== '') return row[key]

            // Try case-insensitive match for primary key
            const keys = Object.keys(row)
            const matchedKey = keys.find(k => k.toLowerCase().trim() === key.toLowerCase())
            if (matchedKey && row[matchedKey] !== '') return row[matchedKey]

            // Try fallback keys
            for (const fk of fallbackKeys) {
                const matchedFk = keys.find(k => k.toLowerCase().trim() === fk.toLowerCase())
                if (matchedFk && row[matchedFk] !== '') return row[matchedFk]
            }

            return undefined
        }

        rawData.forEach((row, index) => {
            const rowNumber = index + 2 // Excel rows start at 1, header is row 1

            try {
                // Debug: log the actual keys in the row for the first row
                if (index === 0) {
                    console.log('Excel column headers found:', Object.keys(row))
                }

                // Map 'stock' to 'quantity' and 'keyFeatures'
                const qtyValue = getValue(row, 'quantity', ['stock'])
                const product: ProductData = {
                    name: String(getValue(row, 'name') || '').trim(),
                    description: String(getValue(row, 'description') || '').trim(),
                    keyFeatures: parseCommaSeparated(getValue(row, 'keyFeatures', ['features', 'highlights'])),
                    price: parseFloat(getValue(row, 'price')) || 0,
                    originalPrice: getValue(row, 'originalPrice') ? parseFloat(getValue(row, 'originalPrice')) : undefined,
                    category: String(getValue(row, 'category') || '').trim(),
                    subCategory: getValue(row, 'subCategory') ? String(getValue(row, 'subCategory')).trim() : undefined,
                    mainCategory: getValue(row, 'mainCategory') ? String(getValue(row, 'mainCategory')).trim() : undefined,
                    images: parseCommaSeparated(getValue(row, 'images')),
                    videos: getValue(row, 'videos') ? parseCommaSeparated(getValue(row, 'videos')) : undefined,
                    quantity: qtyValue !== undefined ? parseInt(qtyValue) : NaN,
                    sku: getValue(row, 'sku') ? String(getValue(row, 'sku')).trim() : undefined,
                    isNew: parseBoolean(getValue(row, 'isNew')),
                    isOnSale: parseBoolean(getValue(row, 'isOnSale')),
                    offerPercentage: getValue(row, 'offerPercentage') ? parseFloat(getValue(row, 'offerPercentage')) : undefined,
                }

                // Default keyFeatures if missing but needed for model
                if (product.keyFeatures.length === 0 && product.description) {
                    // Use first sentence of description as a fallback key feature
                    const firstSentence = product.description.split(/[.!?]/)[0].trim()
                    if (firstSentence) product.keyFeatures = [firstSentence]
                }

                // Validate the product
                const validation = validateProductData(product, rowNumber)

                if (validation.valid) {
                    products.push(product)
                } else {
                    validation.errors.forEach(error => {
                        errors.push({ row: rowNumber, error })
                    })
                }
            } catch (error) {
                errors.push({
                    row: rowNumber,
                    error: `Failed to parse row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`
                })
            }
        })

        return {
            success: errors.length === 0,
            products,
            errors
        }
    } catch (error) {
        return {
            success: false,
            products: [],
            errors: [{
                row: 0,
                error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
            }]
        }
    }
}
