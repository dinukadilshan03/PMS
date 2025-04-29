"use client";
import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    HeartIcon,
    ShoppingCartIcon,
    EyeIcon,
    XMarkIcon,
    PhotoIcon,
    CameraIcon,
    DocumentTextIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

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
            <div className="min-h-screen bg-gradient-to-b from-[#f7f6f2] to-[#e2dacf] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#937d5e]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#f7f6f2] to-[#e2dacf] flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-[#937d5e] text-white rounded-lg hover:bg-[#b8a088] transition-colors duration-300"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f7f6f2] to-[#e2dacf] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif text-[#2d2926] mb-4">Your Wishlist</h1>
                    <p className="text-[#6B7280]">Your favorite photography packages</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
                        <HeartIcon className="mx-auto h-16 w-16 text-[#937d5e] mb-4" />
                        <h3 className="text-xl font-medium text-[#2d2926]">Your wishlist is empty</h3>
                        <p className="mt-2 text-[#6B7280]">
                            Start adding packages to your wishlist to see them here.
                        </p>
                        <div className="mt-8">
                            <button
                                onClick={() => router.push('/packages')}
                                className="inline-flex items-center px-6 py-3 bg-[#937d5e] text-white rounded-lg hover:bg-[#b8a088] transition-colors duration-300"
                            >
                                Browse Packages
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {wishlist.map((item) => {
                            const pkg = packages[item.packageId];
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-serif text-[#2d2926]">{item.packageName}</h3>
                                            <button
                                                onClick={() => removeFromWishlist(item.packageId)}
                                                className="text-[#937d5e] hover:text-red-500 transition-colors duration-300"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-[#f7f6f2] text-[#937d5e] text-sm rounded-full">
                                                {item.packageType}
                                            </span>
                                            <span className="text-xl font-serif text-[#2d2926]">
                                                {item.price.toLocaleString()} LKR
                                            </span>
                                        </div>

                                        {pkg && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-[#6B7280]">Services Included</h4>
                                                    <ul className="space-y-2">
                                                        {pkg.servicesIncluded.map((service, index) => (
                                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                                <CheckIcon className="h-4 w-4 text-[#937d5e]" />
                                                                <span>{service}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-[#6B7280]">Additional Items</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {pkg.additionalItems.editedImages && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <PhotoIcon className="h-4 w-4 text-[#937d5e]" />
                                                                <span>{pkg.additionalItems.editedImages} Edited Images</span>
                                                            </div>
                                                        )}
                                                        {pkg.additionalItems.uneditedImages && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <CameraIcon className="h-4 w-4 text-[#937d5e]" />
                                                                <span>{pkg.additionalItems.uneditedImages} Unedited Images</span>
                                                            </div>
                                                        )}
                                                        {pkg.additionalItems.thankYouCards && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <DocumentTextIcon className="h-4 w-4 text-[#937d5e]" />
                                                                <span>{pkg.additionalItems.thankYouCards} Thank You Cards</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 bg-[#f7f6f2] border-t border-[#e2dacf]">
                                        <div className="flex justify-between gap-3">
                                            <button
                                                onClick={() => router.push(`/bookings/create?packageName=${encodeURIComponent(item.packageName)}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#937d5e] text-white rounded-lg hover:bg-[#b8a088] transition-colors duration-300"
                                            >
                                                <ShoppingCartIcon className="h-5 w-5" />
                                                Book Now
                                            </button>
                                            <button
                                                onClick={() => router.push('/packages/Dashboard')}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#937d5e] border border-[#937d5e] rounded-lg hover:bg-[#f7f6f2] transition-colors duration-300"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
} 