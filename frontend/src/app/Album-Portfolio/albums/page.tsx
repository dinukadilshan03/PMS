'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Album {
    id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    status: string;
    images: string[]; // Array of image filenames
}

export default function AlbumList() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/albums');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAlbums(data);
                console.log(data);
            } catch (err) {
                console.error('Error fetching albums:', err);
                setError('Failed to load albums');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setAlbums(albums.filter(album => album.id !== id));
        } catch (err) {
            console.error('Error deleting album:', err);
            setError('Failed to delete album');
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading albums...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Albums</h2>
                <Link
                    href="albums/create/"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                    Add a New Album
                </Link>
            </div>

            {albums.length === 0 ? (
                <p className="text-gray-500">No albums found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <div key={album.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            {/* Album Images Grid */}
                            {album.images?.length > 0 && (
                                <div className="grid grid-cols-2 gap-1 p-1">
                                    {album.images.slice(0, 4).map((image, index) => (
                                        <div key={index} className="aspect-square bg-gray-100 overflow-hidden">
                                            <img
                                                src={`http://localhost:8080/uploads/${image}`}
                                                alt={`Album ${album.name} image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    console.error('Error loading image:', image);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Album Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold">{album.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{album.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-gray-500">
                                        {album.category} • {album.location}
                                    </span>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                                        onClick={() => handleDelete(album.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}