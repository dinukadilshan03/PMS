'use client'

import { useRouter } from 'next/navigation';  // Import from next/router
import { useState } from 'react';

export default function AlbumForm() {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        location: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        category: '',
        location: '',
        images: '',
        coverImage: '',
    });

    const [images, setImages] = useState<File[]>([]);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const router = useRouter();  // Correct hook import for pages/ directory

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            description: '',
            category: '',
            location: '',
            images: '',
            coverImage: '',
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Album name is required';
            isValid = false;
        } else if (formData.name.length < 3) {
            newErrors.name = 'Album name must be at least 3 characters long';
            isValid = false;
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
            isValid = false;
        }

        // Category validation
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        // Location validation
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
            isValid = false;
        }

        // Images validation
        if (images.length === 0) {
            newErrors.images = 'At least one image is required';
            isValid = false;
        } else {
            // Validate each image
            for (const image of images) {
                if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
                    newErrors.images = 'Only JPG, PNG, and GIF files are allowed';
                    isValid = false;
                    break;
                }
                if (image.size > 10 * 1024 * 1024) { // 10MB
                    newErrors.images = 'Each image must be less than 10MB';
                    isValid = false;
                    break;
                }
            }
        }

        // Cover image validation
        if (!coverImage) {
            newErrors.coverImage = 'Cover image is required';
            isValid = false;
        } else {
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(coverImage.type)) {
                newErrors.coverImage = 'Only JPG, PNG, and GIF files are allowed';
                isValid = false;
            }
            if (coverImage.size > 10 * 1024 * 1024) { // 10MB
                newErrors.coverImage = 'Cover image must be less than 10MB';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
            setErrors({ ...errors, images: '' });
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCoverImage(e.target.files[0]);
            setErrors({ ...errors, coverImage: '' });
        }
    };

    // Handle Submit Function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));

        // Append multiple images
        images.forEach((image) => formDataToSend.append('images', image));

        // Append cover image
        if (coverImage) formDataToSend.append('coverImage', coverImage);

        try {
            const response = await fetch('http://localhost:8080/api/albums', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to create album');
            } else {
                alert('Album created successfully');

                router.push(`/Album-Portfolio/album/pages/`); // Redirect to the album detail page
            }

            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                category: '',
                location: '',
                status: 'active',
            });
            setImages([]);
            setCoverImage(null);
            setErrors({
                name: '',
                description: '',
                category: '',
                location: '',
                images: '',
                coverImage: '',
            });
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Create New Album</h2>
                        <p className="mt-2 text-sm text-gray-600">Fill in the details to create a new photo album</p>
                    </div>

                    {/* Start form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Album Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Album Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter album name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                placeholder="Describe your album..."
                                value={formData.description}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Category & Location (2-column grid on larger screens) */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    placeholder="e.g., Travel, Family"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${
                                        errors.category ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="e.g., Paris, France"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${
                                        errors.location ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Images Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Album Images</label>
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                                errors.images ? 'border-red-500' : 'border-gray-300'
                            } border-dashed rounded-md`}>
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="images"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload images</span>
                                            <input
                                                id="images"
                                                name="images"
                                                type="file"
                                                multiple
                                                onChange={handleImageChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {images.length > 0 && (
                                        <p className="text-sm text-green-600">{images.length} files selected</p>
                                    )}
                                </div>
                            </div>
                            {errors.images && (
                                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                            )}
                        </div>

                        {/* Cover Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                                errors.coverImage ? 'border-red-500' : 'border-gray-300'
                            } border-dashed rounded-md`}>
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="coverImage"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload cover</span>
                                            <input
                                                id="coverImage"
                                                name="coverImage"
                                                type="file"
                                                onChange={handleCoverChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {coverImage && (
                                        <p className="text-sm text-green-600">Cover image selected</p>
                                    )}
                                </div>
                            </div>
                            {errors.coverImage && (
                                <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Album
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
