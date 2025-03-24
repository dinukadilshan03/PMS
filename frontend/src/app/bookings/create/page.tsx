// app/bookings/create/api.ts
"use client"
import React, { useState } from 'react';
import BookingForm from '@/app/bookings/components/BookingForm';

const BookingCreatePage: React.FC = () => {
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);

    const handleSuccess = () => {
        setIsBookingSuccess(true);
    };

    return (
        <div>
            <h1>Create a New Booking</h1>
            {!isBookingSuccess ? (
                <BookingForm onSuccess={handleSuccess} />
            ) : (
                <div>
                    <h2>Booking Successful!</h2>
                    <p>Your booking has been created successfully. A confirmation email has been sent to you.</p>
                </div>
            )}
        </div>
    );
};

export default BookingCreatePage;
