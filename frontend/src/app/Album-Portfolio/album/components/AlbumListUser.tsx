'use client'

import {useEffect, useState} from "react";
import {Album} from "@/app/Album-Portfolio/types/album";
import Link from "next/link";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function AlbumListUser() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState<string[]>([]);

    // Fetch all albums and user's favorite albums
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) return;

                // Fetch albums
                const albumsResponse = await fetch('http://localhost:8080/api/albums');
                if (!albumsResponse.ok) {
                    throw new Error(`HTTP error! status: ${albumsResponse.status}`);
                }
                const albumsData = await albumsResponse.json();
                setAlbums(albumsData);
                setFilteredAlbums(albumsData);

                // Fetch user's favorite albums
                const favoritesResponse = await fetch(`http://localhost:8080/api/users/${userId}/favorites`);
                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    setFavoriteAlbums(favoritesData.map((album: Album) => album.id));
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load albums');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFavorite = async (albumId: string) => {
        try {
            const userId = sessionStorage.getItem('userId');
            if (!userId) return;

            const isCurrentlyFavorite = favoriteAlbums.includes(albumId);
            const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
            
            const response = await fetch(`http://localhost:8080/api/users/${userId}/favorites/${albumId}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setFavoriteAlbums(prev => 
                    isCurrentlyFavorite 
                        ? prev.filter(id => id !== albumId)
                        : [...prev, albumId]
                );
            }
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        if (value.trim() === "") {
            setFilteredAlbums(albums);
        } else {
            const filtered = albums.filter((album: any) =>
                album.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAlbums(filtered);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo Albums</h1>
                    <p className="text-gray-600">Browse through our collection of beautiful photo albums</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            name="search"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search albums..."
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Albums Grid */}
                {filteredAlbums.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">No albums found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAlbums.map((album) => (
                            <div key={album.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                <Link href={`/Album-Portfolio/album/pages/user/${album.id}`}>
                                    {/* Album Images Grid */}
                                    {album.images?.length > 0 && (
                                        <div className="grid grid-cols-2 gap-1 p-1">
                                            {album.images.slice(0, 4).map((image, index) => (
                                                <div key={index} className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
                                                    <img
                                                        src={`http://localhost:8080/uploads/${image}`}
                                                        alt={`Album ${album.name} image ${index + 1}`}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{album.name}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFavorite(album.id);
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            {favoriteAlbums.includes(album.id) ? (
                                                <HeartIconSolid className="h-6 w-6" />
                                            ) : (
                                                <HeartIcon className="h-6 w-6" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{album.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{album.category}</span>
                                        <span>{album.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}