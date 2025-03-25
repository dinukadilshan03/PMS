import { Booking } from '@/app/bookings/types/booking';
import Link from 'next/link';
import { format } from 'date-fns';

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">
                        {format(new Date(booking.dateTime), 'MMMM d, yyyy h:mm a')}
                    </h3>
                    <p className="text-sm text-gray-600">Status: {booking.bookingStatus}</p>
                    <p className="text-sm text-gray-600">Payment: {booking.paymentStatus}</p>
                    <p className="text-sm text-gray-600">Location: {booking.location}</p>
                </div>
                <div className="flex space-x-2">
                    <Link href={`/bookings/${booking.id}/edit`}>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                            Reschedule
                        </button>
                    </Link>
                    <button
                        onClick={() => onCancel(booking.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        disabled={booking.bookingStatus === 'CANCELLED'}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;