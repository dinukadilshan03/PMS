"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BookingFormProps {
    bookingId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        bookingStatus: "",
        paymentStatus: ""
    });
    const [errorDialog, setErrorDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/bookings/${bookingId}`);
                const booking = response.data;
                const dateTime = new Date(booking.dateTime);
                setFormData({
                    date: dateTime.toISOString().split('T')[0],
                    time: dateTime.toTimeString().split(' ')[0].substring(0, 5),
                    bookingStatus: booking.bookingStatus || "",
                    paymentStatus: booking.paymentStatus || ""
                });
            } catch (error) {
                console.error("Error fetching booking:", error);
                setErrorDialog({
                    open: true,
                    title: "Error",
                    message: "Failed to load booking details"
                });
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.date || !formData.time) {
                setErrorDialog({
                    open: true,
                    title: "Validation Error",
                    message: "Date and time are required"
                });
                return;
            }

            // First, get the existing booking to preserve other fields
            const existingBooking = await axios.get(`http://localhost:8080/admin/bookings/${bookingId}`);
            
            // Create a new date object and ensure it's in the future
            const dateTime = new Date(`${formData.date}T${formData.time}`);
            if (dateTime <= new Date()) {
                setErrorDialog({
                    open: true,
                    title: "Validation Error",
                    message: "Booking date must be in the future"
                });
                return;
            }

            // Log the form data and existing booking data
            console.log('Form Data:', formData);
            console.log('Existing Booking:', existingBooking.data);

            // Ensure all required fields are present
            const updatedBooking = {
                ...existingBooking.data,
                dateTime: dateTime.toISOString(),
                bookingStatus: (formData.bookingStatus || existingBooking.data.bookingStatus).toLowerCase(),
                paymentStatus: (formData.paymentStatus || existingBooking.data.paymentStatus).toLowerCase(),
                clientId: existingBooking.data.clientId,
                phoneNumber: existingBooking.data.phoneNumber,
                email: existingBooking.data.email,
                location: existingBooking.data.location,
                packageName: existingBooking.data.packageName,
                price: existingBooking.data.price
            };

            // Log the final updated booking
            console.log('Updated Booking:', updatedBooking);
            
            const response = await axios.put(`http://localhost:8080/admin/bookings/${bookingId}`, updatedBooking);
            if (response.status === 200) {
                router.push("/bookings/admin");
            }
        } catch (error: any) {
            console.error("Error updating booking:", error);
            let errorTitle = "Error";
            let errorMessage = "An error occurred while updating the booking";

            if (error.response) {
                console.error("Error response:", error.response.data);
                switch (error.response.status) {
                    case 400:
                        errorTitle = "Validation Error";
                        errorMessage = error.response.data;
                        break;
                    case 500:
                        errorTitle = "Server Error";
                        errorMessage = error.response.data || "An unexpected error occurred on the server";
                        break;
                    default:
                        errorMessage = error.response.data || `An error occurred (${error.response.status})`;
                }
            } else if (error.request) {
                errorTitle = "Network Error";
                errorMessage = "Could not connect to the server. Please check your internet connection.";
            }

            setErrorDialog({
                open: true,
                title: errorTitle,
                message: errorMessage
            });
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
        <>
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
                            <label htmlFor="bookingStatus" className="block text-sm font-medium leading-6 text-gray-900">
                                Status
                            </label>
                            <div className="mt-2">
                                <select
                                    id="bookingStatus"
                                    name="bookingStatus"
                                    value={formData.bookingStatus}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Status</option>
                                    <option value="upcoming">Upcoming</option>
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
                                    <option value="">Select Payment Status</option>
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
                        onClick={() => router.push("/bookings/admin")}
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

            <Dialog
                open={errorDialog.open}
                onClose={() => setErrorDialog(prev => ({ ...prev, open: false }))}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                        width: '100%',
                        mx: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 600,
                    color: 'error.main',
                    fontSize: '1.25rem',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errorDialog.title}
                </DialogTitle>
                <DialogContent sx={{ 
                    py: 3,
                    px: 3,
                }}>
                    <Typography variant="body1" sx={{ 
                        color: 'text.secondary',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '0.95rem',
                        lineHeight: 1.5
                    }}>
                        {errorDialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ 
                    px: 3,
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    justifyContent: 'flex-end',
                    gap: 1
                }}>
                    <Button 
                        onClick={() => setErrorDialog(prev => ({ ...prev, open: false }))}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '8px',
                            backgroundColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.dark'
                            },
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingForm;