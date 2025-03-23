"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Booking } from '@/app/bookings/types/booking';

const AdminBookingsList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get<Booking[]>('http://localhost:8080/api/admin/bookings');
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch bookings.');
                console.log(err);
            }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (id: string) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/bookings/${id}/cancel`);
            setBookings((prev) => prev.filter((booking) => booking.bookingId !== id));  // Remove cancelled booking
        } catch (err) {
            setError('Failed to cancel booking.');
            console.log(err);
        }
    };

    const updatePaymentStatus = async (id: string, paymentStatus: string) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/bookings/${id}/payment-status`, null, {
                params: { paymentStatus },
            });
            // Re-fetch bookings after status update
            const response = await axios.get<Booking[]>('http://localhost:8080/api/admin/bookings');
            setBookings(response.data);
        } catch (err) {
            setError('Failed to update payment status.');
            console.log(err);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border={1} style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Date & Time</th>
                    <th>Client ID</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {bookings.length === 0 ? (
                    <tr>
                        <td colSpan={8}>No bookings available.</td>
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
                            <td>{booking.location}</td>  {/* Display Location */}
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
};

export default AdminBookingsList;
