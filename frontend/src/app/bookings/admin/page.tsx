'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Booking {
    bookingId: string;
    dateTime: string;
    clientId: string;
    packageId: string;
    status: string;
    paymentStatus: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');

    // Fetch all bookings on page load
    const fetchBookings = async () => {
        try {
            console.log('Fetching all bookings...');
            const response = await axios.get<Booking[]>('http://localhost:8080/api/admin/bookings');
            console.log('Fetched bookings:', response.data);
            setBookings(response.data);  // Update state with fetched bookings
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to fetch bookings.');
        }
    };

    useEffect(() => {
        fetchBookings();  // Fetch all bookings when the page loads
    }, []);  // Empty array ensures it runs only once when the page loads

    // Cancel booking
    const cancelBooking = async (id: string) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/bookings/${id}/cancel`);
            fetchBookings();  // Re-fetch bookings after cancellation
        } catch (err) {
            setError('Failed to cancel booking.');
            console.error(err);
        }
    };

    // Update payment status
    const updatePaymentStatus = async (id: string, paymentStatus: string) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/bookings/${id}/payment-status`, null, {
                params: { paymentStatus },
            });
            fetchBookings();  // Re-fetch bookings after payment status update
        } catch (err) {
            setError('Failed to update payment status.');
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Admin Bookings</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Bookings Table */}
            <table border={1} style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Date & Time</th>
                    <th>Client ID</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {bookings.length === 0 ? (
                    <tr>
                        <td colSpan={7}>No bookings available.</td>
                    </tr>
                ) : (
                    bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{new Date(booking.dateTime).toLocaleString()}</td>
                            <td>{booking.clientId}</td>
                            <td>{booking.packageId}</td>
                            <td>{booking.status}</td>
                            <td>{booking.paymentStatus}</td>
                            <td>
                                <button onClick={() => cancelBooking(booking.bookingId)}>Cancel</button>
                                <button
                                    onClick={() =>
                                        updatePaymentStatus(
                                            booking.bookingId,
                                            booking.paymentStatus === 'Completed' ? 'Pending' : 'Completed'
                                        )
                                    }
                                >
                                    Toggle Payment Status
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
