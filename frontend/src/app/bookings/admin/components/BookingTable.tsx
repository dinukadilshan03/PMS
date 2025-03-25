"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";

interface Booking {
    id: string;
    dateTime: string;
    location: string;
    packageName: string;
    bookingStatus: string;
    paymentStatus: string;
}

const BookingTable = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredBookings = useMemo(() => {
        if (!searchTerm) return bookings;

        const term = searchTerm.toLowerCase();
        return bookings.filter(booking => {
            // Safely handle possible null/undefined values
            const id = booking.id?.toLowerCase() || '';
            const dateTime = booking.dateTime?.toLowerCase() || '';
            const location = booking.location?.toLowerCase() || '';
            const packageName = booking.packageName?.toLowerCase() || '';
            const bookingStatus = booking.bookingStatus?.toLowerCase() || '';
            const paymentStatus = booking.paymentStatus?.toLowerCase() || '';

            return (
                id.includes(term) ||
                dateTime.includes(term) ||
                location.includes(term) ||
                packageName.includes(term) ||
                bookingStatus.includes(term) ||
                paymentStatus.includes(term)
            );
        });
    }, [bookings, searchTerm]);

    return (
        <div className="container mx-auto px-4 sm:px-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="mb-4">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        {[
                            "Booking ID",
                            "Date & Time",
                            "Location",
                            "Package",
                            "Booking Status",
                            "Payment Status",
                            "Actions"
                        ].map((header) => (
                            <th
                                key={header}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                {bookings.length === 0 ? 'No bookings available' : 'No bookings match your search'}
                            </td>
                        </tr>
                    ) : (
                        filteredBookings.map((booking) => (
                            <tr
                                key={booking.id}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{booking.id || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{booking.dateTime || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-gray-700">{booking.location || '-'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            {booking.packageName || '-'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${
                                                booking.bookingStatus === 'Confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : booking.bookingStatus === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {booking.bookingStatus || '-'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${
                                                booking.paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {booking.paymentStatus || '-'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        href={`/bookings/admin/${booking.id}`}
                                        className="group relative inline-flex items-center justify-center
                                            px-4 py-2 overflow-hidden font-medium transition duration-300
                                            ease-out rounded-lg shadow-md
                                            bg-blue-50 text-blue-600
                                            hover:bg-blue-100 hover:text-blue-700
                                            active:translate-y-1 focus:outline-none"
                                    >
                                        <span className="relative z-10">Edit</span>
                                        <span
                                            className="absolute right-0 transform translate-x-full
                                                group-hover:translate-x-0 transition-transform duration-300
                                                ease-in-out flex items-center justify-center"
                                        >
                                                <svg
                                                    className="w-5 h-5 ml-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                    />
                                                </svg>
                                            </span>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;