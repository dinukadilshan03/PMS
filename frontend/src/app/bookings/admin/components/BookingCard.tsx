// /app/bookings/admin/components/BookingCard.tsx
"end" +
""
import React from "react";
import { Booking } from "@/app/bookings/types/booking";

interface BookingCardProps {
    booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
    return (
        <div className="p-4 border rounded-md">
            <h2 className="text-2xl font-bold">Booking ID: {booking.id}</h2>
            <p>
                <strong>Date & Time:</strong> {booking.dateTime}
            </p>
            <p>
                <strong>Status:</strong> {booking.bookingStatus}
            </p>
            <p>
                <strong>Payment Status:</strong> {booking.paymentStatus}
            </p>
        </div>
    );
};

export default BookingCard;
