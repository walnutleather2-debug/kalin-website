/**
 * Cloudinary helpers safe for use in 'use client' components
 */

export const getOptimizedUrl = (url: string, options: { width?: number; height?: number; crop?: string; quality?: string } = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    const { width, height, crop = 'limit', quality = 'auto' } = options;
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    transformations.push('f_auto');

    const transformationString = transformations.join(',');

    // Find the position after /upload/ and insert transformations
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const insertIndex = uploadIndex + '/upload/'.length;
    return url.slice(0, insertIndex) + transformationString + '/' + url.slice(insertIndex);
};
