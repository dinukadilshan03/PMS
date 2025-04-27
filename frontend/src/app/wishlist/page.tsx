"use client";
import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FullPackage {
    id: string;
    name: string;
    investment: number;
    packageType: string;
    servicesIncluded: string[];
    additionalItems: {
        editedImages?: string;
        uneditedImages?: string;
        thankYouCards?: number;
        albums?: { size: string; type: string; spreadCount: number }[];
        framedPortraits?: { size: string; quantity: number }[];
    };
}

export default function WishlistPage() {
    const { wishlist, loading, error, removeFromWishlist } = useWishlist();
    const router = useRouter();
    const [packages, setPackages] = useState<Record<string, FullPackage | null>>({});
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (wishlist.length === 0) return;
        setFetching(true);
        Promise.all(
            wishlist.map(item =>
                fetch(`/api/packages/${item.packageId}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(() => null)
            )
        ).then(results => {
            const pkgs: Record<string, FullPackage | null> = {};
            wishlist.forEach((item, idx) => {
                pkgs[item.packageId] = results[idx];
            });
            setPackages(pkgs);
            setFetching(false);
        });
    }, [wishlist]);

    if (loading || fetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start adding packages to your wishlist to see them here.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/packages')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Browse Packages
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col gap-2"
                            >
                                <h3 className="text-lg font-medium text-gray-900">{item.packageName}</h3>
                                <div className="mt-1 text-lg font-semibold text-indigo-600">{item.price.toLocaleString()} LKR</div>
                                <div className="mt-4 flex justify-between gap-2">
                                    <button
                                        onClick={() => removeFromWishlist(item.packageId)}
                                        className="text-sm font-medium text-red-600 hover:text-red-500 border border-red-200 rounded px-3 py-1"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => router.push(`/bookings/create?packageName=${encodeURIComponent(item.packageName)}`)}
                                        className="text-sm font-medium text-green-600 hover:text-green-500 border border-green-200 rounded px-3 py-1"
                                    >
                                        Book Now
                                    </button>
                                    <button
                                        onClick={() => router.push('/packages/Dashboard')}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-200 rounded px-3 py-1"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 