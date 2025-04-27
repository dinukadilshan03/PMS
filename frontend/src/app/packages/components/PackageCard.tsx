"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '../../../components/WishlistButton';
import { useRouter } from 'next/navigation';

interface PackageCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    type: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
    id,
    name,
    description,
    price,
    imageUrl,
    type,
}) => {
    const router = useRouter();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleWishlistClick = () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setShowLoginPrompt(true);
            return;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
                <p className="mt-2 text-lg font-semibold text-indigo-600">
                    ${price.toFixed(2)}
                </p>
                <div className="mt-4">
                    <Link
                        href={`/packages/${id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Login Required
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Please login to add items to your wishlist.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    router.push('/login');
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackageCard; 