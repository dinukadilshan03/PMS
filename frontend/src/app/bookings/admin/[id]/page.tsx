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

    if (!booking) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Edit Booking {booking.id}</h1>
            <BookingForm bookingId={booking.id} />
        </div>
    );
};

export default BookingDetailPage;
