import BookingList from '@/app/bookings/components/BookingList';
import Link from 'next/link';

const BookingsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:px-8 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Bookings</h1>
                                <p className="mt-2 text-sm text-gray-600">Manage and track all your photography session bookings</p>
                            </div>
                            <Link
                                href="/bookings/create"
                                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create New Booking
                            </Link>
                        </div>
                    </div>
                    <div className="px-6 py-8 sm:px-8">
                        <BookingList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingsPage;