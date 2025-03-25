"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface BookingFormProps {
    bookingId: string;
}

const BookingForm = ({ bookingId }: BookingFormProps) => {
    const [dateTime, setDateTime] = useState<string>("");
    const [bookingStatus, setBookingStatus] = useState<string>("upcoming");
    const [paymentStatus, setPaymentStatus] = useState<string>("pending");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`http://localhost:8080/admin/bookings/${bookingId}`, {
                dateTime,
                bookingStatus,
                paymentStatus,
            });
            router.push("/bookings/admin");
        } catch (error) {
            console.error("Error updating booking:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="dateTime" className="block">Date & Time</label>
                <input
                    id="dateTime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full p-2 border"
                />
            </div>

            <div>
                <label htmlFor="bookingStatus" className="block">Booking Status</label>
                <select
                    id="bookingStatus"
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className="w-full p-2 border"
                >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div>
                <label htmlFor="paymentStatus" className="block">Payment Status</label>
                <select
                    id="paymentStatus"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full p-2 border"
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </form>
    );
};

export default BookingForm;
