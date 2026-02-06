// ImgBB API Configuration
const IMGBB_API_KEY = 'ec2ff8e5a819b13d7322373aa4a5afa1'; // Replace with your actual API key
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload image to ImgBB
 * @param {File} imageFile - The image file to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Returns the uploaded image URL
 */
export async function uploadImageToImgBB(imageFile, onProgress = null) {
    try {
        // Validate file
        if (!imageFile) {
            throw new Error('No image file provided');
        }

        // Check file size (ImgBB limit is 32MB)
        const maxSize = 32 * 1024 * 1024; // 32MB in bytes
        if (imageFile.size > maxSize) {
            throw new Error('Image size must be less than 32MB');
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        if (!validTypes.includes(imageFile.type)) {
            throw new Error('Invalid image format. Please use JPG, PNG, GIF, BMP, or WebP');
        }

        // Create FormData
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('key', IMGBB_API_KEY);

        // Upload with progress tracking
        const response = await fetch(IMGBB_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            // Return the direct image URL
            return result.data.url;
        } else {
            throw new Error(result.error.message || 'Upload failed');
        }

    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
}

/**
 * Preview image before upload
 * @param {File} imageFile - The image file to preview
 * @param {HTMLImageElement} previewElement - The img element to show preview
 */
export function previewImage(imageFile, previewElement) {
    if (imageFile && imageFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
            previewElement.parentElement.style.display = 'block';
        };
        reader.readAsDataURL(imageFile);
    }
}

/**
 * Compress image before upload (optional, for better performance)
 * @param {File} imageFile - The image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export function compressImage(imageFile, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, imageFile.type, quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
    });
}
