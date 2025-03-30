import BookingList from '@/app/bookings/components/BookingList';
import Link from 'next/link';

const BookingsPage = () => {
    return (
        <div className="min-h-screen bg-amber-200 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Your Bookings</h1>
                    <Link
                        href="/bookings/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Create New Booking
                    </Link>
                </div>
                <BookingList />
            </div>
        </div>
    );
};

export default BookingsPage;