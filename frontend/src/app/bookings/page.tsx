'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookingForm from "@/app/bookings/BookingForm";

interface Booking {
    bookingId: string;
    dateTime: string;
    clientId: string;
    packageId: string;
    status: string;
    paymentStatus: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');

    // Fetch all bookings on page load
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get<Booking[]>(
                    'http://localhost:8080/api/bookings'
                );
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch bookings.');
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h1>All Bookings</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Date & Time</th>
                        <th>Client ID</th>
                        <th>Package</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{new Date(booking.dateTime).toLocaleString()}</td>
                            <td>{booking.clientId}</td>
                            <td>{booking.packageId}</td>
                            <td>{booking.status}</td>
                            <td>{booking.paymentStatus}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <div>
                <h1>Booking form </h1>
                <BookingForm/>
            </div>
        </div>

    );
}
