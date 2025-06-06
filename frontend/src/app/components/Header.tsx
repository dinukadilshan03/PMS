"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check login status on mount and when storage changes
        const checkLoginStatus = () => {
            const userId = sessionStorage.getItem('userId');
            const userEmail = sessionStorage.getItem('email');
            const role = sessionStorage.getItem('role');
            
            console.log('Session Storage Values:');
            console.log('User ID:', userId);
            console.log('Email:', userEmail);
            console.log('Role:', role);
            
            setIsLoggedIn(!!userId);
            setEmail(userEmail || '');
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        window.addEventListener('loginStateChange', checkLoginStatus);
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStateChange', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        console.log('Logging out user:', email);
        sessionStorage.clear();
        setIsLoggedIn(false);
        setIsProfileMenuOpen(false);
        router.push('/');
    };

    const handleEmailClick = async () => {
        const role = sessionStorage.getItem('role');
        const userId = sessionStorage.getItem('userId');
        
        if (role === 'CUSTOMER' && userId) {
            router.push(`/UserProfile/profile`);
        } else {
            try {
                // Search for staff by email
                const response = await fetch(`http://localhost:8080/api/staff/search?email=${encodeURIComponent(email)}`);
                if (!response.ok) {
                    throw new Error('Failed to find staff profile');
                }
                
                const staffData = await response.json();
                if (staffData && staffData.id) {
                    // Navigate to staff profile page
                    router.push(`/staff/staffprofile/${staffData.id}`);
                    setIsProfileMenuOpen(false);
                } else {
                    console.error('Staff profile not found');
                }
            } catch (error) {
                console.error('Error fetching staff profile:', error);
            }
        }
    };

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Bookings', href: '/bookings' },
        { name: 'Portfolio', href: '/Album-Portfolio/portfolio/pages/user/' },
        { name: 'Albums', href: '/Album-Portfolio/album/pages/user/' },
        { name: 'Packages', href: '/packages/Dashboard' },
        { name: 'Testimonials', href: '/feedback' },
        { name: 'Wishlist', href: '/wishlist' },
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
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200">
                                            <span className="text-lg font-semibold text-gray-700">
                                                {email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>
                                    
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                            <div 
                                                onClick={handleEmailClick}
                                                className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                            >
                                                {email}
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                    <div className="px-3 py-2">
                                        <div 
                                            onClick={handleEmailClick}
                                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                                <span className="text-lg font-semibold text-gray-700">
                                                    {email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-base font-medium text-gray-700">{email}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="mt-2 block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
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