'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Album } from "@/app/Album-Portfolio/types/album";

export default function EditPortfolioForm() {
    const router = useRouter();
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [formData, setFormData] = useState({
        albumName: "",
        description: "",
        photographerName: "",
        category: "",
    });
    const [image, setImage] = useState<File | null>(null);

    // Update the formData when portfolio data is fetched
    useEffect(() => {
        if (portfolio) {
            setFormData({
                albumName: portfolio.albumName || "",
                description: portfolio.description || "",
                photographerName: portfolio.photographerName || "",
                category: portfolio.category || "",
            });
        }
    }, [portfolio]);

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

        const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
            method: "PUT",
            body: data,
        });

        const result = await response.json();
        console.log(result);
        router.push("/Album-Portfolio/portfolio/pages/");
    };

    // Fetch all available albums
    useEffect(() => {
        const fetchAllAlbums = async () => {
            const response = await fetch('http://localhost:8080/api/albums');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAlbums(data);
            console.log(data);
        };
        fetchAllAlbums();
    }, []);

    // Fetch the portfolio details based on the ID
    useEffect(() => {
        const fetchPortfolio = async (id: String) => {
            try {
                const response = await fetch(`http://localhost:8080/api/portfolio/${id}`);
                if (!response.ok) {
                    throw new Error("Portfolio Not Found");
                } else {
                    const data = await response.json();
                    setPortfolio(data);
                    console.log(data);
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };
        fetchPortfolio(id as String);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Portfolio</h1>
                    <p className="mt-2 text-sm text-gray-600">Update your portfolio details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="albumName" className="block text-sm font-medium text-gray-700">
                            Album Name
                        </label>
                        <select
                            id="albumName"
                            name="albumName"
                            value={formData.albumName}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Select Album</option>
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
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md p-2"
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
                            value={formData.photographerName}
                            onChange={handleChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
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
                            Portfolio Image
                        </label>
                        <div className="mt-1 flex items-center">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-4">
                        <button
                            type="button"
                            onClick={() => router.push("/Album-Portfolio/portfolio/pages/")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}