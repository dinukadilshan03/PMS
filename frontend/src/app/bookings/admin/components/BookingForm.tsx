"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface BookingFormProps {
    bookingId: string;
}

const BookingForm = ({ bookingId }: BookingFormProps) => {
    const [formData, setFormData] = useState({
        dateTime: "",
        bookingStatus: "upcoming",
        paymentStatus: "pending"
    });
    const [errors, setErrors] = useState({
        dateTime: "",
        bookingStatus: "",
        paymentStatus: "",
        form: ""
    });
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();

    // Validate form whenever formData changes
    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {
            dateTime: "",
            bookingStatus: "",
            paymentStatus: "",
            form: ""
        };

        // Date & Time validation
        if (!formData.dateTime) {
            newErrors.dateTime = "Date and time are required";
        } else {
            const selectedDate = new Date(formData.dateTime);
            const currentDate = new Date();
            if (selectedDate < currentDate && formData.bookingStatus !== "completed") {
                newErrors.dateTime = "Cannot book in the past unless status is 'completed'";
            }
        }



        setErrors(newErrors);
        setIsFormValid(
            !newErrors.dateTime &&
            !newErrors.bookingStatus &&
            !newErrors.paymentStatus &&
            !newErrors.form &&
            !!formData.dateTime
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            setErrors(prev => ({
                ...prev,
                form: "Please fix all errors before submitting"
            }));
            return;
        }

        setLoading(true);
        setErrors(prev => ({ ...prev, form: "" }));

        try {
            await axios.put(`http://localhost:8080/admin/bookings/${bookingId}`, {
                dateTime: formData.dateTime,
                bookingStatus: formData.bookingStatus,
                paymentStatus: formData.paymentStatus,
            });
            router.push("/bookings/admin");
        } catch (error) {
            console.error("Error updating booking:", error);
            setErrors(prev => ({
                ...prev,
                form: "Failed to update booking. Please try again."
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-amber-200">
            <div className="w-full max-w-3xl p-8 border-2 border-gray-200 rounded-xl shadow-xl bg-white">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Update Booking</h2>
                <p className="text-center text-gray-600 mb-6">
                    Modify booking details for booking ID: <strong>{bookingId}</strong>
                </p>

                {(errors.form || errors.dateTime || errors.bookingStatus || errors.paymentStatus) && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        {errors.form && <p className="font-bold mb-2">{errors.form}</p>}
                        <ul className="list-disc pl-5 space-y-1">
                            {errors.dateTime && <li>{errors.dateTime}</li>}
                            {errors.bookingStatus && <li>{errors.bookingStatus}</li>}
                            {errors.paymentStatus && <li>{errors.paymentStatus}</li>}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Date & Time */}
                    <div>
                        <label htmlFor="dateTime" className="block text-lg font-medium text-gray-700 mb-2">
                            Date & Time
                        </label>
                        <input
                            id="dateTime"
                            type="datetime-local"
                            value={formData.dateTime}
                            onChange={handleChange}
                            required
                            className={`block w-full px-4 py-3 border ${errors.dateTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out`}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {errors.dateTime && (
                            <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
                        )}
                    </div>

                    {/* Booking Status */}
                    <div>
                        <label htmlFor="bookingStatus" className="block text-lg font-medium text-gray-700 mb-2">
                            Booking Status
                        </label>
                        <select
                            id="bookingStatus"
                            value={formData.bookingStatus}
                            onChange={handleChange}
                            className={`block w-full px-4 py-3 border ${errors.bookingStatus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out`}
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.bookingStatus && (
                            <p className="mt-1 text-sm text-red-600">{errors.bookingStatus}</p>
                        )}
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label htmlFor="paymentStatus" className="block text-lg font-medium text-gray-700 mb-2">
                            Payment Status
                        </label>
                        <select
                            id="paymentStatus"
                            value={formData.paymentStatus}
                            onChange={handleChange}
                            className={`block w-full px-4 py-3 border ${errors.paymentStatus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out`}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.paymentStatus && (
                            <p className="mt-1 text-sm text-red-600">{errors.paymentStatus}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full py-3 px-4 text-lg font-bold rounded-md text-white 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-fuchsia-700 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'}
                            transition duration-300 ease-in-out`}
                            aria-disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Saving...
                                </div>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;