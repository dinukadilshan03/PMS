'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Package {
    id: string;
    name: string;
}

interface BookingData {
    dateTime: string;
    clientId: string;
    packageId: string;
    status: string;
    paymentStatus: string;
    phoneNumber: string;
    email: string;
}

export default function BookingForm() {
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [packageId, setPackageId] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [packages] = useState<Package[]>([
        { id: 'package1', name: 'Basic Package' },
        { id: 'package2', name: 'Premium Package' },
        { id: 'package3', name: 'Deluxe Package' },
    ]);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Fetch available slots whenever the date is selected
    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        try {
            const response = await axios.get<string[]>(
                `http://localhost:8080/api/bookings/available-slots?date=${selectedDate}`
            );
            setAvailableSlots(response.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to fetch available slots.');
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!time || !packageId || !phoneNumber || !email) {
            setError('All fields are required.');
            return;
        }


        const bookingData: BookingData = {
            dateTime: time, // Correct date-time format
            clientId: 'client1', // Hardcoded for now, replace with actual client ID
            packageId,
            status: 'Pending',
            paymentStatus: 'Pending',
            phoneNumber,
            email,
        };

        try {
            await axios.post('http://localhost:8080/api/bookings', bookingData);
            setSuccessMessage('Booking created successfully!');
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Booking creation failed.');
            setSuccessMessage('');
            console.error(err);
        }
    };


    return (
        <div>
            <h1>Photography Booking</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Time:
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        >
                            <option value="">Select a time</option>
                            {availableSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                    {new Date(slot).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Package:
                        <select
                            value={packageId}
                            onChange={(e) => setPackageId(e.target.value)}
                            required
                        >
                            <option value="">Select a package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <button type="submit">Book Now</button>
                </div>
            </form>
        </div>
    );
}
