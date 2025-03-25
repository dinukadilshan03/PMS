"use client";
import { useState, useEffect, useRef } from 'react';
import { Booking } from '../types/booking';
import { jsPDF } from "jspdf";

const BookingList = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string>('');
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newDateTime, setNewDateTime] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in');
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
        const userId = localStorage.getItem('userId');
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
        const userId = localStorage.getItem('userId');
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
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(booking =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            ));

            setIsRescheduleModalOpen(false);
            setNewDateTime('');
        } catch (err) {
            const errorMessage = 'Error rescheduling the booking: booking limit reached for this day';
            setError(errorMessage);
            alert(errorMessage);  // Alert the same message you set
            console.error('Rescheduling error:', err);  // Log the actual error
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Your Bookings</h1>
                <button
                    onClick={generatePDF}
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
                >
                    Download as PDF
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div ref={contentRef}>
                <ul className="space-y-4">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="border p-4 rounded-lg shadow-sm">
                            <p className="text-lg font-semibold"><strong>Package:</strong> {booking.packageName}</p>
                            <p className="text-gray-600"><strong>Date:</strong> {new Date(booking.dateTime).toLocaleString()}</p>
                            <p className="text-gray-600"><strong>Status:</strong>
                                <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                                    booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {booking.bookingStatus}
                                </span>
                            </p>
                            <div className="flex mt-4">
                                <button
                                    onClick={() => handleCancel(booking.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow mr-2 hover:bg-red-600 transition"
                                    disabled={booking.bookingStatus === 'Cancelled'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReschedule(booking)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition"
                                    disabled={booking.bookingStatus === 'Cancelled'}
                                >
                                    Reschedule
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal for Rescheduling */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>
                        <label className="block mb-2">
                            New Date and Time:
                            <input
                                type="datetime-local"
                                value={newDateTime}
                                onChange={(e) => setNewDateTime(e.target.value)}
                                className="border p-2 rounded w-full mt-1"
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </label>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSubmitReschedule}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setIsRescheduleModalOpen(false);
                                    setNewDateTime('');
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow ml-2 hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;