"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { parseExcelFile, ProductData } from '@/lib/excel-upload'

interface ExcelUploadProps {
    onUploadComplete?: () => void
}

export default function ExcelUpload({ onUploadComplete }: ExcelUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [products, setProducts] = useState<ProductData[]>([])
    const [parseErrors, setParseErrors] = useState<Array<{ row: number; error: string }>>([])
    const [uploading, setUploading] = useState(false)
    const [uploadResult, setUploadResult] = useState<{
        created: number
        failed: number
        errors?: Array<{ index: number; error: string }>
    } | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Reset state
        setFile(selectedFile)
        setProducts([])
        setParseErrors([])
        setUploadResult(null)

        // Parse the file
        const result = await parseExcelFile(selectedFile)

        if (result.success) {
            setProducts(result.products)
            setParseErrors([])
        } else {
            setProducts(result.products)
            setParseErrors(result.errors)
        }
    }

    const handleUpload = async () => {
        if (products.length === 0) return

        setUploading(true)
        setUploadResult(null)

        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products }),
            })

            const data = await response.json()
            setUploadResult(data)

            if (data.success && onUploadComplete) {
                onUploadComplete()
            }
        } catch (error) {
            console.error('Upload error:', error)
            setUploadResult({
                created: 0,
                failed: products.length,
                errors: [{ index: 0, error: 'Failed to upload products' }]
            })
        } finally {
            setUploading(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setProducts([])
        setParseErrors([])
        setUploadResult(null)
    }

    return (
        <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#510c74] transition-colors">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                />
                <label htmlFor="excel-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-4">
                        <FileSpreadsheet className="w-16 h-16 text-gray-400" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">
                                {file ? file.name : 'Upload Excel File'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Click to browse or drag and drop your .xlsx or .xls file
                            </p>
                        </div>
                        <div
                            className="mt-2 inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors hover:bg-gray-50"
                            style={{ borderColor: '#510c74', color: '#510c74' }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                        </div>
                    </div>
                </label>
            </div>

            {/* Parse Errors */}
            {parseErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-2">Validation Errors</h3>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {parseErrors.map((error, index) => (
                                    <p key={index} className="text-sm text-red-700">
                                        {error.error}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Preview */}
            {products.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                            Products Preview ({products.length} products)
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Review the first 10 products before uploading
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Price</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Quantity</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-700">Images</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.slice(0, 10).map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-4 py-2 text-gray-600">{product.category}</td>
                                        <td className="px-4 py-2 text-gray-600">₹{product.price}</td>
                                        <td className="px-4 py-2 text-gray-600">{product.quantity}</td>
                                        <td className="px-4 py-2 text-gray-600">{product.images.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {products.length > 10 && (
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center border-t border-gray-200">
                            ... and {products.length - 10} more products
                        </div>
                    )}
                </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
                <div className={`border rounded-lg p-4 ${uploadResult.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-start space-x-3">
                        {uploadResult.failed === 0 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                            <XCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <h3 className={`font-semibold mb-2 ${uploadResult.failed === 0 ? 'text-green-900' : 'text-yellow-900'}`}>
                                Upload Complete
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-green-700">✓ Successfully created: {uploadResult.created} products</p>
                                {uploadResult.failed > 0 && (
                                    <p className="text-red-700">✗ Failed: {uploadResult.failed} products</p>
                                )}
                            </div>
                            {uploadResult.errors && uploadResult.errors.length > 0 && (
                                <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                                    {uploadResult.errors.map((error, index) => (
                                        <p key={index} className="text-sm text-red-700">
                                            Product {error.index}: {error.error}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <Button
                    onClick={handleUpload}
                    disabled={products.length === 0 || parseErrors.length > 0 || uploading}
                    className="flex-1"
                    style={{ backgroundColor: '#510c74', color: '#fff' }}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload {products.length} Products
                        </>
                    )}
                </Button>
                {(file || uploadResult) && (
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        disabled={uploading}
                    >
                        Reset
                    </Button>
                )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Excel Format Instructions</h4>
                <p className="text-sm text-blue-800 mb-2">
                    Your Excel file should have the following columns in this exact order:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>name (required)</li>
                    <li>description (required)</li>
                    <li>keyFeatures (required - comma-separated)</li>
                    <li>price (required)</li>
                    <li>originalPrice (optional)</li>
                    <li>category (required)</li>
                    <li>subCategory (optional)</li>
                    <li>mainCategory (optional)</li>
                    <li>images (required - comma-separated Cloudinary URLs)</li>
                    <li>videos (optional - comma-separated Cloudinary URLs)</li>
                    <li>quantity (required - same as stock)</li>
                    <li>sku (optional)</li>
                    <li>isNew (optional - TRUE/FALSE)</li>
                    <li>isOnSale (optional - TRUE/FALSE)</li>
                    <li>offerPercentage (optional - 0-100)</li>
                </ol>
            </div>
        </div>
    )
}
