// app/Album-Portfolio/album/pages/[id]/page.tsx
'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAlbumForm() {
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchAlbum = async (id: string) => {
                try {
                    const response = await fetch(`http://localhost:8080/api/albums/${id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    const data = await response.json();
                    setAlbum(data);
                } catch (error) {
                    console.error("Error fetching album:", error);
                    setError("Failed to load album");
                } finally {
                    setLoading(false);
                }
            };
            fetchAlbum(id as string);
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(album),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            router.push('/Album-Portfolio/album/pages');
        } catch (error) {
            console.error("Error updating album:", error);
            setError("Failed to update album");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                <button
                    onClick={() => router.push('/Album-Portfolio/album/pages')}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                >
                    ← Back to albums
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => router.push('/Album-Portfolio/album/pages')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
                >
                    <span className="mr-1 text-xl">←</span> Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Edit Album</h2>
            </div>

            {/* Album Images Gallery */}
            {album?.images?.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Album Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {album.images.map((image: string, index: number) => (
                            <div key={index} className="relative group">
                                <img
                                    src={`http://localhost:8080/uploads/${image}`}
                                    alt={`Album image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md shadow-sm border border-gray-200"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedImages = [...album.images];
                                        updatedImages.splice(index, 1);
                                        setAlbum({...album, images: updatedImages});
                                    }}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Existing form fields */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Album Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={album?.name || ""}
                        onChange={(e) => setAlbum({ ...album, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={album?.description || ""}
                        onChange={(e) => setAlbum({ ...album, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Add More Images
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                    <span>Upload files</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        multiple
                                        className="sr-only"
                                        onChange={(e) => {
                                            // Handle file upload logic here
                                            // You would typically upload to your server
                                            // then add the new image URLs to the album state
                                        }}
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

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.push('/Album-Portfolio/album/pages')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}