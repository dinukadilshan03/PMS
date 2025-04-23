"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        setIsLoggedIn(!!userId);
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-screen overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-background.jpg"
                        alt="Background"
                        fill
                        priority
                        className="object-cover brightness-50"
                        quality={100}
                    />
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
                </div>

                {/* Content Container */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="text-center">
                        {/* Main Heading with Gradient */}
                        <h1 className="text-6xl md:text-8xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                                Capture Your
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-white to-gray-200">
                                Perfect Moment
                            </span>
                        </h1>

                        {/* Subtitle with enhanced styling */}
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Professional photography services for all your special occasions
                        </p>

                        {/* CTA Buttons with enhanced styling */}
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button
                                onClick={() => router.push('/bookings/create')}
                                className="group relative px-8 py-4 text-lg font-medium rounded-lg overflow-hidden bg-white text-black hover:bg-gray-100 transition-all duration-300"
                            >
                                <span className="relative z-10">Book a Session</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={() => router.push('/portfolio')}
                                className="group relative px-8 py-4 text-lg font-medium rounded-lg overflow-hidden border-2 border-white text-white hover:text-black transition-all duration-300"
                            >
                                <span className="relative z-10">View Portfolio</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">500+</div>
                                <div className="text-gray-400">Events Captured</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">10+</div>
                                <div className="text-gray-400">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">100%</div>
                                <div className="text-gray-400">Client Satisfaction</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                                <div className="text-gray-400">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator with enhanced animation */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Event Booking Section */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 lg:pr-12">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                <span className="block text-black">EVENT BOOKING</span>
                            </h2>
                            <h3 className="mt-4 text-3xl font-semibold text-gray-900">
                                Schedule your perfect photoshoot with our easy-to-use booking system
                            </h3>
                            <p className="mt-6 text-lg leading-7 text-gray-600">
                                Our streamlined booking system makes it easy to schedule your dream photoshoot. Choose from various time slots, select your preferred package, and customize your session to match your vision. Perfect for weddings, corporate events, family portraits, and special occasions.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Instant availability checking</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Flexible scheduling options</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Package customization</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Secure online payment</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => router.push('/bookings/create')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                        <div className="mt-10 lg:mt-0 lg:w-1/2">
                            <div className="relative">
                                <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Albums Section */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 lg:pr-12 order-2">
                            <div className="relative">
                                <div className="aspect-w-1 aspect-h-1 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 order-1">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                <span className="block text-black">PHOTO ALBUMS</span>
                            </h2>
                            <h3 className="mt-4 text-3xl font-semibold text-gray-900">
                                Browse through our collection of beautifully captured moments
                            </h3>
                            <p className="mt-6 text-lg leading-7 text-gray-600">
                                Explore our extensive collection of professionally curated photo albums. Each album tells a unique story, showcasing our commitment to capturing life's most precious moments with artistic excellence and attention to detail.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>High-resolution images</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Digital and physical albums</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Custom album designs</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Cloud storage access</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => router.push('/albums')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150"
                                >
                                    View Albums
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Packages Section */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 lg:pr-12">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                <span className="block text-black">EVENT PACKAGES</span>
                            </h2>
                            <h3 className="mt-4 text-3xl font-semibold text-gray-900">
                                Find the perfect photography package for your special occasion
                            </h3>
                            <p className="mt-6 text-lg leading-7 text-gray-600">
                                Choose from our carefully crafted photography packages designed to meet every need and budget. From intimate gatherings to grand celebrations, we have the perfect package to capture your special moments.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Customizable packages</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Multiple photographer options</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Same-day preview images</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Professional editing included</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => router.push('/packages')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150"
                                >
                                    View Packages
                                </button>
                            </div>
                        </div>
                        <div className="mt-10 lg:mt-0 lg:w-1/2">
                            <div className="relative">
                                <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 lg:pr-12 order-2">
                            <div className="relative">
                                <div className="aspect-w-1 aspect-h-1 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 order-1">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                <span className="block text-black">PORTFOLIO</span>
                            </h2>
                            <h3 className="mt-4 text-3xl font-semibold text-gray-900">
                                Explore our professional work and photography style
                            </h3>
                            <p className="mt-6 text-lg leading-7 text-gray-600">
                                Discover our diverse portfolio showcasing years of professional photography experience. From candid moments to staged perfection, our work demonstrates our passion for capturing the essence of every event and subject.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Various photography styles</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Different event types</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Portrait collections</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Commercial projects</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => router.push('/portfolio')}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-150"
                                >
                                    View Portfolio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        <span className="block">Ready to get started?</span>
                        <span className="block text-gray-300">Start capturing your moments today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => router.push('/bookings/create')}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100"
                            >
                                Book Now
                            </button>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <button
                                onClick={() => router.push('/packages')}
                                className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-gray-900"
                            >
                                View Packages
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}