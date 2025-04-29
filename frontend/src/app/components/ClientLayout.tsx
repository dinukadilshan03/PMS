"use client";

import Header from "./Header";
import Footer from "./Footer";
import { WishlistProvider } from '../../context/WishlistContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);
    
    useEffect(() => {
        // Get user role from sessionStorage
        const role = sessionStorage.getItem('role');
        setUserRole(role);
    }, []);

    // Check if current path is an admin-related path or if user is admin viewing portfolio/album pages
    const isAdminRelatedPage = 
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/staff') ||
        pathname?.startsWith('/bookings/admin') ||
        pathname?.startsWith('/bookings/config') ||
        (userRole?.toUpperCase() === 'ADMIN' && (
            pathname?.startsWith('/Album-Portfolio/album/pages') ||
            pathname?.startsWith('/Album-Portfolio/portfolio/pages')
        )) ||
        pathname?.startsWith('/packages/Ad_View');

    return (
        <WishlistProvider>
            {!isAdminRelatedPage && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdminRelatedPage && <Footer />}
        </WishlistProvider>
    );
} 