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
            return (
                booking.id?.toLowerCase().includes(term) ||
                booking.dateTime?.toLowerCase().includes(term) ||
                booking.location?.toLowerCase().includes(term) ||
                booking.packageName?.toLowerCase().includes(term) ||
                booking.bookingStatus?.toLowerCase().includes(term) ||
                booking.paymentStatus?.toLowerCase().includes(term)
            );
        });
    }, [bookings, searchTerm]);

    return (
        <div className="container mx-auto px-4">
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

            <div className="bg-white rounded-lg shadow">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                        <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date & Time</th>
                        <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                        <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Package</th>
                        <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment</th>
                        <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                {bookings.length === 0 ? 'No bookings available' : 'No bookings match your search'}
                            </td>
                        </tr>
                    ) : (
                        filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 truncate">{booking.id || '-'}</td>
                                <td className="px-4 py-3 truncate">{booking.dateTime || '-'}</td>
                                <td className="px-4 py-3 truncate">{booking.location || '-'}</td>
                                <td className="px-4 py-3">
                                        <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            {booking.packageName || '-'}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                                            booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.bookingStatus || '-'}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                                            booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.paymentStatus || '-'}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/bookings/admin/${booking.id}`}
                                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
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