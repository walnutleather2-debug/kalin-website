
interface CloudinarySignResponse {
    success: boolean
    signature: string
    timestamp: number
    apiKey: string
    cloudName: string
    folder: string
    error?: string
}

interface UploadResult {
    url: string
    publicId: string
}

/**
 * Uploads a file directly to Cloudinary from the client side
 */
export const uploadToCloudinaryClient = async (
    file: File,
    resourceType: 'image' | 'video' = 'image',
    folderName: string = 'kalin/products'
): Promise<UploadResult> => {
    try {
        // 1. Get signature from backend
        const signatureParams: any = {
            folder: folderName,
            resource_type: resourceType
        }

        // Add eager parameters to signature request if it's an image
        if (resourceType === 'image') {
            signatureParams.eager = 'w_800,h_800,c_limit,q_auto,f_auto'
        }

        const signResponse = await fetch('/api/upload/sign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signatureParams),
        })

        const signData: CloudinarySignResponse = await signResponse.json()

        if (!signData.success || !signData.signature) {
            throw new Error(signData.error || 'Failed to get upload signature')
        }

        // 2. Upload directly to Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', signData.apiKey)
        formData.append('timestamp', signData.timestamp.toString())
        formData.append('signature', signData.signature)
        formData.append('folder', signData.folder)
        // Add transformations for images to optimize size
        if (resourceType === 'image') {
            formData.append('eager', 'w_800,h_800,c_limit,q_auto,f_auto')
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`

        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        })

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error?.message || 'Cloudinary upload failed')
        }

        const uploadResult = await uploadResponse.json()

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }

    } catch (error) {
        console.error('Client-side upload error:', error)
        throw error
    }
}

/**
 * Uploads multiple files in parallel
 */
export const uploadMultipleFilesClient = async (
    files: File[],
    resourceType: 'image' | 'video' = 'image',
    folderName?: string
): Promise<UploadResult[]> => {
    if (!files || files.length === 0) return []

    const uploadPromises = files.map(file =>
        uploadToCloudinaryClient(file, resourceType, folderName)
    )

    return Promise.all(uploadPromises)
}
