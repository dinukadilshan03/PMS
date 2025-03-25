// pages/bookings.tsx
import BookingList from '@/app/bookings/components/BookingList';

const BookingsPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold">Manage Your Bookings</h1>
            <BookingList />
        </div>
    );
};

export default BookingsPage;
