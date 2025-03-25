"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Booking {
    id: string;
    dateTime: string;
    bookingStatus: string;
    paymentStatus: string;
}

const BookingTable = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/bookings");
                setBookings(response.data);
            } catch (error) {
                setError("Failed to fetch bookings. Please try again later.");
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="overflow-x-auto">
            {error && <div className="text-red-500">{error}</div>}
            <table className="min-w-full table-auto">
                <thead>
                <tr>
                    <th className="px-4 py-2 border">Booking ID</th>
                    <th className="px-4 py-2 border">Date & Time</th>
                    <th className="px-4 py-2 border">Booking Status</th>
                    <th className="px-4 py-2 border">Payment Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {bookings.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-4">No bookings available</td>
                    </tr>
                ) : (
                    bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td className="px-4 py-2 border">{booking.id}</td>
                            <td className="px-4 py-2 border">{booking.dateTime}</td>
                            <td className="px-4 py-2 border">{booking.bookingStatus}</td>
                            <td className="px-4 py-2 border">{booking.paymentStatus}</td>
                            <td className="px-4 py-2 border">
                                <Link href={`/bookings/admin/${booking.id}`} className="text-blue-500">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingTable;
