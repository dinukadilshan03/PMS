"use client"
import { useState, useEffect } from 'react';
import { Booking } from '../types/booking';

const BookingList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newDateTime, setNewDateTime] = useState<string>('');

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/bookings/client', {
                    method: 'GET',
                    headers: {
                        'userId': userId,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError('Error fetching bookings: ' + err.message);
                console.error(err);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (bookingId: string) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User not logged in');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/cancel/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'userId': userId,

                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel the booking');
            }

            // Update the status of the booking to "Cancelled" instead of deleting it
            setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, bookingStatus: 'Cancelled' } : booking
            ));
        } catch (err) {
            setError('Error canceling the booking: ' + err.message);
            console.error(err);
        }
    };

    const handleReschedule = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsRescheduleModalOpen(true);
    };

    const handleSubmitReschedule = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User not logged in');
            return;
        }

        if (!newDateTime) {
            setError('Please select a valid date and time');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/reschedule/${selectedBooking?.id}`, {
                method: 'PUT',
                headers: {
                    'userId': userId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDateTime),
            });

            if (!response.ok) {
                throw new Error('Failed to reschedule the booking');
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(booking =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            ));
            setIsRescheduleModalOpen(false);
        } catch (err) {
            setError('Error rescheduling the booking: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Your Bookings</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.id} className="border-b p-4">
                        <p><strong>Package:</strong> {booking.packageName}</p>
                        <p><strong>Date:</strong> {booking.dateTime}</p>
                        <p><strong>Status:</strong> {booking.bookingStatus}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => handleCancel(booking.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReschedule(booking)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Reschedule
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for Reschedule */}
            {isRescheduleModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Reschedule Booking</h2>
                        <label>
                            New Date and Time:
                            <input
                                type="datetime-local"
                                value={newDateTime}
                                onChange={(e) => setNewDateTime(e.target.value)}
                                className="border p-2"
                            />
                        </label>
                        <button onClick={handleSubmitReschedule} className="bg-blue-500 text-white px-4 py-2 mt-4">
                            Submit
                        </button>
                        <button onClick={() => setIsRescheduleModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 mt-4 ml-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
