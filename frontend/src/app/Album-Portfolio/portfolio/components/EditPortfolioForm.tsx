'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Album } from "@/app/Album-Portfolio/types/album";
import { Staff } from "@/app/staff/types/staff";

export default function EditPortfolioForm() {
    const router = useRouter();
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
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

    //Handle Submit Function
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
        };
        fetchAllAlbums();
    }, []);

    // Fetch all staff members
    useEffect(() => {
        const fetchAllStaff = async () => {
            const response = await fetch('http://localhost:8080/api/staff');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStaff(data);
        };
        fetchAllStaff();
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
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };
        fetchPortfolio(id as String);
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
                            <p className="mt-3 text-lg text-gray-600">Update your portfolio details below</p>
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
                                        value={formData.albumName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
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
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="portrait">Portrait</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    placeholder="Describe your portfolio..."
                                />
                            </div>

                            <div>
                                <label htmlFor="photographerName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Photographer
                                </label>
                                <select
                                    id="photographerName"
                                    name="photographerName"
                                    value={formData.photographerName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                >
                                    <option value="">Select Photographer</option>
                                    {staff.map((staffMember) => (
                                        <option key={staffMember.id} value={staffMember.name}>
                                            {staffMember.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Portfolio Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-blue-500 transition duration-200">
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
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push("/Album-Portfolio/portfolio/pages/")}
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                >
                                    Update Portfolio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}