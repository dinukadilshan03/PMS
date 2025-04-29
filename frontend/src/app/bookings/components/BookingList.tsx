"use client";
import { useState, useEffect, useRef } from 'react';
import { Booking } from '../types/booking';
import { jsPDF } from "jspdf";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    Typography,
    Box
} from '@mui/material';

interface BookingConfig {
    maxBookingsPerDay: number;
    minAdvanceBookingDays: number;
    maxAdvanceBookingDays: number;
    cancellationWindowHours: number;
    rescheduleWindowHours: number;
}

const BookingList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newDateTime, setNewDateTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);
    const [limitDialog, setLimitDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
    }>({
        open: false,
        title: '',
        message: ''
    });
    const [cancelDialog, setCancelDialog] = useState<{
        open: boolean;
        bookingId: string | null;
        bookingDetails: string;
    }>({
        open: false,
        bookingId: null,
        bookingDetails: ''
    });
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/bookings/client', {
                    method: 'GET',
                    headers: {
                        'userId': userId,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? `Error fetching bookings: ${err.message}`
                    : 'Error fetching bookings: An unknown error occurred';
                setError(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Fetch booking configuration
    useEffect(() => {
        const fetchBookingConfig = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/bookings/config");
                if (!response.ok) {
                    throw new Error('Failed to fetch booking configuration');
                }
                const data = await response.json();
                setBookingConfig({
                    maxBookingsPerDay: data.maxBookingsPerDay,
                    minAdvanceBookingDays: data.minAdvanceBookingDays,
                    maxAdvanceBookingDays: data.maxAdvanceBookingDays,
                    cancellationWindowHours: data.cancellationWindowHours,
                    rescheduleWindowHours: data.rescheduleWindowHours
                });
            } catch (error) {
                console.error("Error fetching booking configuration:", error);
            }
        };
        fetchBookingConfig();
    }, []);

    const generatePDF = () => {
        if (!contentRef.current) return;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add header with logo and title
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229); // Indigo color
        doc.setFont('helvetica', 'bold');
        doc.text('Your Bookings', 105, 25, { align: 'center' });

        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139); // Slate color
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });

        // Add decorative line
        doc.setDrawColor(79, 70, 229); // Indigo color
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        let yPosition = 50;
        const pageHeight = doc.internal.pageSize.height - 20;
        const margin = 20;

        // Add each booking with modern styling
        bookings.forEach((booking, index) => {
            // Add new page if needed
            if (yPosition > pageHeight) {
                doc.addPage();
                yPosition = margin;
            }

            // Booking header
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229); // Indigo color
            doc.setFont('helvetica', 'bold');
            doc.text(`Booking #${index + 1}`, margin, yPosition);
            yPosition += 10;

            // Package name
            doc.setFontSize(12);
            doc.setTextColor(51, 65, 85); // Slate color
            doc.setFont('helvetica', 'bold');
            doc.text('Package:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(booking.packageName, margin + 25, yPosition);
            yPosition += 8;

            // Date and Time
            doc.setFont('helvetica', 'bold');
            doc.text('Date & Time:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(new Date(booking.dateTime).toLocaleString(), margin + 35, yPosition);
            yPosition += 8;

            // Status with colored badge
            doc.setFont('helvetica', 'bold');
            doc.text('Status:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            const statusColor = getStatusColor(booking.bookingStatus);
            let statusRGB;
            if (statusColor === 'bg-red-100 text-red-800') {
                statusRGB = { r: 220, g: 38, b: 38 }; // Red
            } else if (statusColor === 'bg-green-100 text-green-800') {
                statusRGB = { r: 22, g: 163, b: 74 }; // Green
            } else if (statusColor === 'bg-blue-100 text-blue-800') {
                statusRGB = { r: 29, g: 78, b: 216 }; // Blue
            } else {
                statusRGB = { r: 51, g: 65, b: 85 }; // Slate
            }
            doc.setTextColor(statusRGB.r, statusRGB.g, statusRGB.b);
            doc.text(booking.bookingStatus, margin + 25, yPosition);
            yPosition += 8;

            // Location
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(51, 65, 85);
            doc.text('Location:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(booking.location, margin + 25, yPosition);
            yPosition += 8;

            // Payment Status
            doc.setFont('helvetica', 'bold');
            doc.text('Payment:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(booking.paymentStatus, margin + 25, yPosition);
            yPosition += 8;

            // Add decorative separator
            doc.setDrawColor(226, 232, 240); // Light slate color
            doc.setLineWidth(0.2);
            doc.line(margin, yPosition, 190, yPosition);
            yPosition += 15;
        });

        // Add footer
        const pageCount = doc.internal.pages.length;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
        }

        doc.save('bookings-list.pdf');
    };

    const generateSingleBookingPDF = (booking: Booking) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add header with logo and title
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229); // Indigo color
        doc.setFont('helvetica', 'bold');
        doc.text('Booking Details', 105, 25, { align: 'center' });

        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139); // Slate color
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });

        // Add decorative line
        doc.setDrawColor(79, 70, 229); // Indigo color
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        let yPosition = 50;
        const margin = 20;

        // Package name
        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229); // Indigo color
        doc.setFont('helvetica', 'bold');
        doc.text('Package:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85); // Slate color
        doc.text(booking.packageName, margin + 25, yPosition);
        yPosition += 10;

        // Date and Time
        doc.setFont('helvetica', 'bold');
        doc.text('Date & Time:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(booking.dateTime).toLocaleString(), margin + 35, yPosition);
        yPosition += 10;

        // Status with colored badge
        doc.setFont('helvetica', 'bold');
        doc.text('Status:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        const statusColor = getStatusColor(booking.bookingStatus);
        let statusRGB;
        if (statusColor === 'bg-red-100 text-red-800') {
            statusRGB = { r: 220, g: 38, b: 38 }; // Red
        } else if (statusColor === 'bg-green-100 text-green-800') {
            statusRGB = { r: 22, g: 163, b: 74 }; // Green
        } else if (statusColor === 'bg-blue-100 text-blue-800') {
            statusRGB = { r: 29, g: 78, b: 216 }; // Blue
        } else {
            statusRGB = { r: 51, g: 65, b: 85 }; // Slate
        }
        doc.setTextColor(statusRGB.r, statusRGB.g, statusRGB.b);
        doc.text(booking.bookingStatus, margin + 25, yPosition);
        yPosition += 10;

        // Location
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text('Location:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(booking.location, margin + 25, yPosition);
        yPosition += 10;

        // Payment Status
        doc.setFont('helvetica', 'bold');
        doc.text('Payment:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(booking.paymentStatus, margin + 25, yPosition);
        yPosition += 10;

        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('Page 1 of 1', 105, 287, { align: 'center' });

        doc.save(`booking-${booking.id}.pdf`);
    };

    const handleCancelClick = (booking: Booking) => {
        setCancelDialog({
            open: true,
            bookingId: booking.id,
            bookingDetails: `${booking.packageName} scheduled for ${new Date(booking.dateTime).toLocaleString()}`
        });
    };

    const handleCancel = async (bookingId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel booking');
            }

            // Update the booking status in the local state
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, bookingStatus: 'cancelled' }
                        : booking
                )
            );

            // Close the cancel dialog
            setCancelDialog(prev => ({ ...prev, open: false }));

            // Show success message
            setLimitDialog({
                open: true,
                title: 'Success',
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setLimitDialog({
                open: true,
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to cancel booking'
            });
        }
    };

    const handleReschedule = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsRescheduleModalOpen(true);
    };

    const handleSubmitReschedule = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setError('User not logged in');
            return;
        }

        if (!newDateTime) {
            setError('Please select a valid date and time');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/reschedule/${selectedBooking?.id}`, {
                method: 'PUT',
                headers: {
                    'userId': userId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dateTime: newDateTime }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to reschedule booking';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                
                if (errorMessage.includes('Cannot create more than')) {
                    setLimitDialog({
                        open: true,
                        title: 'Booking Limit Reached',
                        message: errorMessage
                    });
                    return;
                }
                throw new Error(errorMessage);
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(booking =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            ));

            setIsRescheduleModalOpen(false);
            setNewDateTime('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            setLimitDialog({
                open: true,
                title: 'Error',
                message: errorMessage
            });
            console.error('Rescheduling error:', err);
        }
    };

    const handleCreateBooking = async (bookingData: any) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setError('User not logged in');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/bookings/create', {
                method: 'POST',
                headers: {
                    'userId': userId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message?.includes('Cannot create more than')) {
                    setLimitDialog({
                        open: true,
                        title: 'Booking Limit Reached',
                        message: errorData.message
                    });
                    return;
                }
                throw new Error(errorData.message || 'Failed to create booking');
            }

            const newBooking = await response.json();
            setBookings([...bookings, newBooking]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error('Booking creation error:', err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
                        <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                        </span>
                    </div>
                    <button
                        onClick={generatePDF}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                    </button>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={contentRef} className="hidden">
                    {/* Hidden content for PDF generation */}
                    <h1 className="text-2xl font-bold">Your Bookings</h1>
                    <p>Generated on: {new Date().toLocaleDateString()}</p>
                    {bookings.map((booking, index) => (
                        <div key={booking.id}>
                            <h2>Booking #{index + 1}</h2>
                            <p>Package: {booking.packageName}</p>
                            <p>Date: {new Date(booking.dateTime).toLocaleString()}</p>
                            <p>Status: {booking.bookingStatus}</p>
                        </div>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
                        <div className="mt-6">
                            <a
                                href="/bookings/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Booking
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                                                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">{booking.packageName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(booking.dateTime).toLocaleDateString()} at {new Date(booking.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Location</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{booking.location}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Payment</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{booking.paymentStatus}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div className="mt-5 flex space-x-2">
                                        <button
                                            onClick={() => handleCancelClick(booking)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                            disabled={booking.bookingStatus === 'cancelled'}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(booking)}
                                            disabled={booking.bookingStatus.toLowerCase() === 'cancelled'}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                                booking.bookingStatus.toLowerCase() === 'cancelled' 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                                            }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => generateSingleBookingPDF(booking)}
                                            className="inline-flex items-center justify-center p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            title="Download PDF"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Rescheduling */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-3xl">
                        <div className="px-6 pt-6 pb-4 sm:p-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
                                        <svg className="h-7 w-7 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4 w-full">
                                    <h3 className="text-xl font-medium leading-6 text-gray-900" id="modal-title">
                                        Reschedule Booking
                                    </h3>
                                    <div className="mt-4">
                                        <p className="text-base text-gray-500">
                                            Current booking date and time: <span className="font-medium text-gray-900">{new Date(selectedBooking?.dateTime || '').toLocaleString()}</span>
                                        </p>
                                        
                                        <div className="mt-6 space-y-4">
                                            <div className="bg-yellow-50 p-4 rounded-md">
                                                <h4 className="text-base font-medium text-yellow-800 mb-3">Scheduling Rules:</h4>
                                                <ul className="text-base text-yellow-700 space-y-2 list-disc list-inside">
                                                    <li>Maximum {bookingConfig?.maxBookingsPerDay || 3} bookings allowed per day</li>
                                                    <li>Bookings must be made at least {bookingConfig?.minAdvanceBookingDays || 1} day(s) in advance</li>
                                                    <li>Rescheduling must be done at least {bookingConfig?.rescheduleWindowHours || 24} hours before the current booking time</li>
                                                    <li>New date must be within {bookingConfig?.maxAdvanceBookingDays || 30} days from today</li>
                                                </ul>
                                            </div>

                                            <div className="mt-6">
                                                <label htmlFor="newDateTime" className="block text-base font-medium text-gray-700 mb-2">
                                                    Select New Date and Time
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    id="newDateTime"
                                                    value={newDateTime}
                                                    onChange={(e) => setNewDateTime(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 text-base sm:leading-6"
                                                    min={new Date().toISOString().slice(0, 16)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={handleSubmitReschedule}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2.5 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-base"
                            >
                                Confirm Reschedule
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRescheduleModalOpen(false);
                                    setNewDateTime('');
                                }}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Limit Dialog */}
            <Dialog
                open={limitDialog.open}
                onClose={() => setLimitDialog(prev => ({ ...prev, open: false }))}
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
                    {limitDialog.title}
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
                        {limitDialog.message}
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
                        onClick={() => setLimitDialog(prev => ({ ...prev, open: false }))}
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

            {/* Add Cancellation Confirmation Dialog */}
            <Dialog
                open={cancelDialog.open}
                onClose={() => setCancelDialog(prev => ({ ...prev, open: false }))}
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
                    Cancel Booking
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
                        Are you sure you want to cancel this booking for {cancelDialog.bookingDetails}?
                        This action cannot be undone.
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
                        onClick={() => setCancelDialog(prev => ({ ...prev, open: false }))}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '8px',
                            borderColor: 'grey.300',
                            color: 'text.primary',
                            '&:hover': {
                                backgroundColor: 'grey.50',
                                borderColor: 'grey.400'
                            },
                            px: 3
                        }}
                    >
                        Keep Booking
                    </Button>
                    <Button 
                        onClick={() => cancelDialog.bookingId && handleCancel(cancelDialog.bookingId)}
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
                        Cancel Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingList;