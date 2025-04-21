"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check login status on mount and when storage changes
        const checkLoginStatus = () => {
            const userId = sessionStorage.getItem('userId');
            setIsLoggedIn(!!userId);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        router.push('/');
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Bookings', href: '/bookings' },
        { name: 'Portfolio', href: '/Album-Portfolio/portfolio/pages/user/' },
        { name: 'Albums', href: '/Album-Portfolio/album/pages/user/' },
        { name: 'Packages', href: '/packages/Dashboard' },
        { name: 'Testimonials', href: '/testimonials' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="w-full py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-gray-900">
                                PhotoStudio
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        isActive(item.href)
                                            ? 'text-black border-b-2 border-black'
                                            : 'text-gray-500 hover:text-gray-900'
                                    } px-1 py-2 text-sm font-medium transition-colors duration-200`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-red-500 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition duration-150"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/login')}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition duration-150"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <span className="sr-only">Open menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 border-t border-gray-200">
                            <div className="pt-4 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            isActive(item.href)
                                                ? 'bg-gray-50 text-black'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            router.push('/login');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header; 