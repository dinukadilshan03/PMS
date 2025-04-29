"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Album } from "@/app/Album-Portfolio/types/album";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        contactNumber: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;

        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/auth/profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch profile');
                }

                const data = await res.json();
                setUser({
                    name: data.name,
                    email: data.email,
                    contactNumber: data.contactNumber || '',
                    role: data.role
                });

                // Fetch favorite albums
                const favoritesResponse = await fetch(`http://localhost:8080/api/users/${userId}/favorites`);
                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    setFavoriteAlbums(favoritesData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
                if (err instanceof Error && err.message === 'Unauthorized') {
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [hasMounted, router, refreshKey]);

    const handleLogout = () => {
        sessionStorage.clear();
        router.push('/login');
    };

    if (!hasMounted || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                <p className="text-gray-900">{user.role}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                <p className="text-gray-900">{user.name}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                <p className="text-gray-900">{user.contactNumber || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setRefreshKey(prev => prev + 1);
                                    router.push('/UserProfile/edit');
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Favorite Albums Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorite Albums</h2>
                {favoriteAlbums.length === 0 ? (
                    <p className="text-gray-500">No favorite albums yet</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favoriteAlbums.map((album) => (
                            <Link 
                                key={album.id} 
                                href={`/Album-Portfolio/album/pages/user/${album.id}`}
                                className="block"
                            >
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:scale-105 h-[200px] w-full">
                                    <div className="h-[140px] w-full">
                                        <img
                                            src={album.images?.[0] ? `http://localhost:8080/uploads/${album.images[0]}` : '/images/album-placeholder.jpg'}
                                            alt={album.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="p-2 h-[60px]">
                                        <h3 className="text-sm font-medium text-gray-800 truncate">{album.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}