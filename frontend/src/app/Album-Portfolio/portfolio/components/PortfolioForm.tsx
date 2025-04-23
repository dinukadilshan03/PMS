'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Album} from "@/app/Album-Portfolio/types/album";

export default function PortfolioForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        albumName: "",
        description: "",
        photographerName: "",
        category: "",
    });
    const [image, setImage] = useState<File | null>(null);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append("albumName", formData.albumName);
        data.append("description", formData.description);
        data.append("photographerName", formData.photographerName);
        data.append("category", formData.category);
        if (image) data.append('image', image);

        const response = await fetch("http://localhost:8080/api/portfolio", {
            method: "POST",
            body: data
        });

        const result = await response.json();
        console.log(result);
        router.push("/Album-Portfolio/portfolio/pages/");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Create New Portfolio</h2>
                        <p className="mt-2 text-sm text-gray-600">Fill in the details below to create your portfolio</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
                                Album Name
                            </label>
                            <select
                                id="albumName"
                                name="albumName"
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option>Select Album Name</option>
                                {albums.map((album) => (
                                    <option key={album.id} value={album.name}>
                                        {album.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                onChange={handleChange}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                        </div>

                        <div>
                            <label htmlFor="photographerName" className="block text-sm font-medium text-gray-700">
                                Photographer Name
                            </label>
                            <input
                                type="text"
                                id="photographerName"
                                name="photographerName"
                                onChange={handleChange}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select Category</option>
                                <option value="portrait">Portrait</option>
                                <option value="wedding">Wedding</option>
                                <option value="commercial">Commercial</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Select Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="image"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
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
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Portfolio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}