"use client";
import { useState, useEffect } from 'react';
import { Booking } from '../types/booking';

const BookingList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchBookings = async () => {
            // Retrieve the userId from localStorage
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in');
                return;
            }

            try {
                // Fetch bookings with the userId in request headers
                const response = await fetch('http://localhost:8080/api/bookings/client', {
                    method: 'GET',
                    headers: {
                        'userId': userId, // Add userId from localStorage to headers
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

    const handleCancel = (bookingId: string) => {
        // Placeholder for cancel action
        alert(`Booking with ID ${bookingId} is canceled.`);
    };

    const handleReschedule = (bookingId: string) => {
        // Placeholder for reschedule action
        alert(`Booking with ID ${bookingId} is rescheduled.`);
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
                                onClick={() => handleReschedule(booking.id)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Reschedule
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingList;
