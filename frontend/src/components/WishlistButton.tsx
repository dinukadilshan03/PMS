"use client";
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
    packageId: string;
    packageType: string;
    packageName: string;
    price: number;
    imageUrl: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
    packageId,
    packageType,
    packageName,
    price,
    imageUrl,
}) => {
    const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
    const router = useRouter();
    const inWishlist = isInWishlist(packageId);

    const handleClick = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        try {
            if (inWishlist) {
                await removeFromWishlist(packageId);
            } else {
                await addToWishlist({
                    packageId,
                    packageType,
                    packageName,
                    price,
                    imageUrl,
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`p-2 rounded-full transition-colors duration-200 ${
                inWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {inWishlist ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
            )}
        </button>
    );
};

export default WishlistButton; 