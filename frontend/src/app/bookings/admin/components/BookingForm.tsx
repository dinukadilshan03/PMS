"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BookingFormProps {
    bookingId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        status: "",
        paymentStatus: ""
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/bookings/${bookingId}`);
                const booking = response.data;
                setFormData({
                    date: booking.dateTime ? new Date(booking.dateTime).toISOString().split('T')[0] : "",
                    time: booking.dateTime ? new Date(booking.dateTime).toTimeString().split(' ')[0] : "",
                    status: booking.bookingStatus || "",
                    paymentStatus: booking.paymentStatus || ""
                });
            } catch (error) {
                console.error("Error fetching booking:", error);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);
            const updatedBooking = {
                dateTime: dateTime.toISOString(),
                bookingStatus: formData.status,
                paymentStatus: formData.paymentStatus
            };
            
            await axios.put(`http://localhost:8080/admin/bookings/${bookingId}`, updatedBooking);
            router.push("/bookings/admin");
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                            Date
                        </label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="date"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                            Time
                        </label>
                        <div className="mt-2">
                            <input
                                type="time"
                                name="time"
                                id="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                            Status
                        </label>
                        <div className="mt-2">
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="paymentStatus" className="block text-sm font-medium leading-6 text-gray-900">
                            Payment Status
                        </label>
                        <div className="mt-2">
                            <select
                                id="paymentStatus"
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                    type="button"
                    onClick={() => router.push("/admin/bookings")}
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default BookingForm;