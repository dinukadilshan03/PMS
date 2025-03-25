import BookingList from '@/app/bookings/components/BookingList';

const BookingsPage = () => {
    return (
        <div className="min-h-screen bg-amber-200 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Your Bookings</h1>
                <BookingList />
            </div>
        </div>
    );
};

export default BookingsPage;