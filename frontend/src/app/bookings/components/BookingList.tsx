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

const BookingList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newDateTime, setNewDateTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [limitDialog, setLimitDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
    }>({
        open: false,
        title: '',
        message: ''
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

    const generatePDF = () => {
        if (!contentRef.current) return;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add title
        doc.setFontSize(20);
        doc.text('Your Bookings', 105, 20, { align: 'center' });

        // Add current date
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

        let yPosition = 40;
        const pageHeight = doc.internal.pageSize.height - 20;
        const margin = 20;

        // Add each booking
        doc.setFontSize(12);
        bookings.forEach((booking, index) => {
            // Add new page if needed
            if (yPosition > pageHeight) {
                doc.addPage();
                yPosition = margin;
            }

            doc.setFont('helvetica', 'bold');
            doc.text(`Booking #${index + 1}`, margin, yPosition);
            yPosition += 8;

            doc.setFont('helvetica', 'normal');
            doc.text(`Package: ${booking.packageName}`, margin, yPosition);
            yPosition += 8;

            doc.text(`Date: ${new Date(booking.dateTime).toLocaleString()}`, margin, yPosition);
            yPosition += 8;

            doc.text(`Status: ${booking.bookingStatus}`, margin, yPosition);
            yPosition += 8;

            // Add some space between bookings
            yPosition += 10;
        });

        doc.save('bookings-list.pdf');
    };

    const handleCancel = async (bookingId: string) => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setError('User not logged in');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/cancel/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'userId': userId,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, bookingStatus: 'Cancelled' } : booking
            ));
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            alert(message);
            console.error(err);
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
                const errorData = await response.json();
                if (errorData.message?.includes('Cannot create more than')) {
                    setLimitDialog({
                        open: true,
                        title: 'Booking Limit Reached',
                        message: errorData.message
                    });
                    return;
                }
                throw new Error(errorData.message || 'Failed to reschedule booking');
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
                                            onClick={() => handleCancel(booking.id)}
                                            disabled={booking.bookingStatus === 'Cancelled'}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                                booking.bookingStatus === 'Cancelled' 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                            }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(booking)}
                                            disabled={booking.bookingStatus === 'Cancelled'}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                                                booking.bookingStatus === 'Cancelled' 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                                            }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Reschedule
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
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Reschedule Booking
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Select a new date and time for your booking. Please note that there is a limit of 3 bookings per day.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700">
                                        New Date and Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="newDateTime"
                                        value={newDateTime}
                                        onChange={(e) => setNewDateTime(e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSubmitReschedule}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Confirm Reschedule
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRescheduleModalOpen(false);
                                        setNewDateTime('');
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
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
                        borderRadius: 0,
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    letterSpacing: '-0.5px'
                }}>
                    {limitDialog.title}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {limitDialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setLimitDialog(prev => ({ ...prev, open: false }))}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 0
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingList;