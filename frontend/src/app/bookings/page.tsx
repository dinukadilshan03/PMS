import BookingList from '@/app/bookings/components/BookingList';
import Link from 'next/link';

const BookingsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="px-8 py-10 sm:px-10 border-b border-gray-200/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <h1 className="text-4xl font-bold text-gray-800 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Your Photography Bookings
                                </h1>
                                <p className="mt-3 text-lg text-gray-600" style={{ fontFamily: "'Lora', serif" }}>
                                    Curate and manage your upcoming photo sessions with ease
                                </p>
                            </div>
                            <Link
                                href="/bookings/create"
                                className="group inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-2 transform group-hover:scale-110 transition-transform"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Schedule a New Session
                            </Link>
                        </div>
                    </div>
                    <div className="px-8 py-10 sm:px-10">
                        <BookingList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingsPage;