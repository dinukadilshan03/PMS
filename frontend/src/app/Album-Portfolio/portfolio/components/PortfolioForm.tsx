'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Album} from "@/app/Album-Portfolio/types/album";
import {Staff} from "@/app/staff/types/staff";

export default function PortfolioForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        albumName: "",
        description: "",
        photographerName: "",
        category: "",
    });

    const [errors, setErrors] = useState({
        albumName: "",
        description: "",
        photographerName: "",
        category: "",
        image: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);

    // Fetch all available albums
    useEffect(() => {
        const fetchAllAlbums = async () => {
            const response = await fetch('http://localhost:8080/api/albums');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAlbums(data);
        };
        fetchAllAlbums();
    }, []);

    useEffect(() => {
        const fetchAllPhotographers = async () => {
            const response = await fetch(`http://localhost:8080/api/staff`)

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setStaff(data);
        }
        fetchAllPhotographers()
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            albumName: "",
            description: "",
            photographerName: "",
            category: "",
            image: "",
        };

        // Album Name validation
        if (!formData.albumName.trim()) {
            newErrors.albumName = "Please select an album";
            isValid = false;
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        } else if (formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters long";
            isValid = false;
        }

        // Photographer Name validation
        if (!formData.photographerName.trim()) {
            newErrors.photographerName = "Please select a photographer";
            isValid = false;
        }

        // Category validation
        if (!formData.category.trim()) {
            newErrors.category = "Please select a category";
            isValid = false;
        }

        // Image validation
        if (!image) {
            newErrors.image = "Portfolio image is required";
            isValid = false;
        } else {
            // Check file type
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
                newErrors.image = "Only JPG, PNG, and GIF files are allowed";
                isValid = false;
            }
            // Check file size (10MB)
            if (image.size > 10 * 1024 * 1024) {
                newErrors.image = "Image must be less than 10MB";
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
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
            setErrors({ ...errors, image: "" });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const data = new FormData();
        data.append("albumName", formData.albumName);
        data.append("description", formData.description);
        data.append("photographerName", formData.photographerName);
        data.append("category", formData.category);
        if (image) data.append('image', image);

        try {
            const response = await fetch("http://localhost:8080/api/portfolio", {
                method: "POST",
                body: data
            });

            if (!response.ok) {
                throw new Error('Failed to create portfolio');
            }

            const result = await response.json();
            console.log(result);
            
            // Reset form after successful submission
            setFormData({
                albumName: "",
                description: "",
                photographerName: "",
                category: "",
            });
            setImage(null);
            setErrors({
                albumName: "",
                description: "",
                photographerName: "",
                category: "",
                image: "",
            });
            
            router.push("/Album-Portfolio/portfolio/pages/");
        } catch (error) {
            console.error('Error creating portfolio:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">Create New Portfolio</h2>
                            <p className="mt-3 text-lg text-gray-600">Fill in the details to showcase your photography work</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="albumName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Album Name
                                    </label>
                                    <select
                                        id="albumName"
                                        name="albumName"
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.albumName ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                    >
                                        <option value="">Select Album Name</option>
                                        {albums.map((album) => (
                                            <option key={album.id} value={album.name}>
                                                {album.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.albumName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.albumName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.category ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="portrait">Portrait</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.description ? 'border-red-500' : 'border-gray-200'
                                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                    placeholder="Describe your portfolio..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="photographerName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Photographer
                                </label>
                                <select
                                    id="photographerName"
                                    name="photographerName"
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.photographerName ? 'border-red-500' : 'border-gray-200'
                                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                >
                                    <option value="">Select Photographer</option>
                                    {staff.map((staffMember) => (
                                        <option key={staffMember.id} value={staffMember.name}>
                                            {staffMember.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.photographerName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.photographerName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Portfolio Image
                                </label>
                                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                                    errors.image ? 'border-red-500' : 'border-gray-200'
                                } border-dashed rounded-lg hover:border-blue-500 transition duration-200`}>
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
                                                htmlFor="image"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                        {image && (
                                            <p className="text-sm text-green-600">Image selected</p>
                                        )}
                                    </div>
                                </div>
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                >
                                    Create Portfolio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}