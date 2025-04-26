'use client'

import {useEffect, useState} from "react";
import {Album} from "@/app/Album-Portfolio/types/album";
import Link from "next/link";

export default function AlbumListUser(){

    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);

    // Fetch all albums from backend
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/albums');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAlbums(data);
                setFilteredAlbums(data)
                console.log(data)

            } catch (err) {
                console.error('Error fetching albums:', err);
                setError('Failed to load albums');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    const handleSearch = (value: string) => {
        setSearch(value);

        if (value.trim() === "") {
            // If the search bar is cleared, show all albums
            setFilteredAlbums(albums);
        } else {
            // Filter albums based on the search query
            const filtered = albums.filter((album: any) =>
                album.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAlbums(filtered);
        }
    }

    if (loading) {
        return <div className="p-6 text-center text-xl text-gray-500">Loading albums...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500 text-xl">{error}</div>;
    }

    return(
        <div>
            <div className="relative mb-6">
                <input
                    type="text"
                    id="search"
                    name="search"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search albums..."
                />
                <div className="absolute top-0 right-0 p-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6"/>
                    </svg>

                </div>
            </div>

            {filteredAlbums.length === 0 ? (
                <p className="text-gray-500 text-xl">No albums found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAlbums.map((album) => (
                        <div key={album.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <Link href={`/Album-Portfolio/album/pages/user/${album.id}`}>
                                {/* Album Images Grid */}
                                {album.images?.length > 0 && (
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        {album.images.slice(0, 4).map((image, index) => (
                                            <div key={index} className="aspect-square bg-gray-100 overflow-hidden rounded-md">
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
                            </Link>

                            {/* Album Info */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800">{album.name}</h3>
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{album.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs text-gray-500">
                                        {album.category} • {album.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}