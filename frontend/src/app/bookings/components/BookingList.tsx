"use client";
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
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, bookingStatus: 'Cancelled' } : booking
            ));
        } catch (err) {
            setError(err.message);
            alert(err.message);
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
                body: JSON.stringify({ dateTime: newDateTime }), // Send dateTime as an object
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(booking =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            ));

            setIsRescheduleModalOpen(false);
        } catch (err) {
            setError('Error rescheduling the booking: ' + 'booking limit reached for this day');
            alert(err.message);
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Bookings</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ul className="space-y-4">
                {bookings.map((booking) => (
                    <li key={booking.id} className="border p-4 rounded-lg shadow-sm">
                        <p className="text-lg font-semibold"><strong>Package:</strong> {booking.packageName}</p>
                        <p className="text-gray-600"><strong>Date:</strong> {booking.dateTime}</p>
                        <p className="text-gray-600"><strong>Status:</strong> {booking.bookingStatus}</p>
                        <div className="flex mt-4">
                            <button
                                onClick={() => handleCancel(booking.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md shadow mr-2 hover:bg-red-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReschedule(booking)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition"
                            >
                                Reschedule
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for Rescheduling */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>
                        <label className="block mb-2">
                            New Date and Time:
                            <input
                                type="datetime-local"
                                value={newDateTime}
                                onChange={(e) => setNewDateTime(e.target.value)}
                                className="border p-2 rounded w-full mt-1"
                            />
                        </label>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleSubmitReschedule} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">
                                Submit
                            </button>
                            <button onClick={() => setIsRescheduleModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md shadow ml-2 hover:bg-gray-600 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;