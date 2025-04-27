// /app/bookings/admin/pages/[id].tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation"; // Use useParams for dynamic routes in Next.js 13
import BookingForm from "../components/BookingForm";

const BookingDetailPage = () => {
    const [booking, setBooking] = useState<any>(null);
    const { id } = useParams(); // Using useParams to get dynamic route params

    useEffect(() => {
        if (id) {
            const fetchBooking = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/admin/bookings/${id}`);
                    setBooking(response.data);
                } catch (error) {
                    console.error("Error fetching booking details:", error);
                }
            };

            fetchBooking();
        }
    }, [id]);

    if (!booking) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Edit Booking
                        </h2>
                        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Booking #{booking.id}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {booking.bookingStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                    <div className="h-full rounded-lg border-4 border-dashed border-gray-200 p-4">
                        <BookingForm bookingId={booking.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;
