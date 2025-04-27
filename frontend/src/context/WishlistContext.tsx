"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: string;
    packageId: string;
    packageType: string;
    packageName: string;
    price: number;
    imageUrl: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
    removeFromWishlist: (packageId: string) => Promise<void>;
    isInWishlist: (packageId: string) => boolean;
    loading: boolean;
    error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetchWishlist(userId);
        }
    }, []);

    const fetchWishlist = async (userId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/wishlist/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch wishlist');
            const data = await response.json();
            setWishlist(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (item: Omit<WishlistItem, 'id'>) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) throw new Error('User not logged in');

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/wishlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, userId }),
            });

            if (!response.ok) throw new Error('Failed to add to wishlist');
            await fetchWishlist(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (packageId: string) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) throw new Error('User not logged in');

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/wishlist/remove?userId=${userId}&packageId=${packageId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to remove from wishlist');
            await fetchWishlist(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isInWishlist = (packageId: string) => {
        return wishlist.some(item => item.packageId === packageId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                loading,
                error,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}; 