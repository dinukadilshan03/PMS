"use client";

import Header from "./Header";
import Footer from "./Footer";
import { WishlistProvider } from '../../context/WishlistContext';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Check if current path is an admin-related path
    const isAdminRelatedPage = 
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/staff') ||
        pathname?.startsWith('/bookings/admin') ||
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