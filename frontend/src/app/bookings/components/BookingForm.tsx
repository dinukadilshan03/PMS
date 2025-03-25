// components/CreateBookingForm.tsx
"use client"
import { useState } from 'react';

const CreateBookingForm = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [packageName, setPackageName] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [error, setError] = useState<string>('');
    const [packages, setPackages] = useState([
        { id: '1', name: 'Package A' },
        { id: '2', name: 'Package B' },
        { id: '3', name: 'Package C' },
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Retrieve userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You must be logged in to make a booking');
            return;
        }

        // Prepare the booking data
        const bookingData = {
            email,
            phoneNumber,
            location,
            packageName,
            dateTime,
        };

        try {
            const response = await fetch('http://localhost:8080/api/bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId, // Add userId from localStorage to headers
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error('booking limit reached for this day');
            }

            // Handle success
            alert('Booking created successfully!');
            setEmail('');
            setPhoneNumber('');
            setLocation('');
            setPackageName('');
            setDateTime('');
        } catch (err) {
            setError('Error creating booking: ' + err.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Create a New Booking</h2>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="package" className="block text-sm font-medium text-gray-700">Package</label>
                    <select
                        id="package"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select a package</option>
                        {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="dateTime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Create Booking
                </button>
            </form>
        </div>
    );
};

export default CreateBookingForm;
