"use client";
import { useState } from 'react';

const CreateBookingForm = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [packageName, setPackageName] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [error, setError] = useState<string>('');
    const [packages] = useState([
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
                throw new Error('Booking limit reached for this day');
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
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-2xl p-8 border-2 border-gray-300 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create a New Booking</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="package" className="block text-lg font-medium text-gray-700 mb-1">Package</label>
                        <select
                            id="package"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select a package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dateTime" className="block text-lg font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="dateTime"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <button type="submit" className="bg-amber-700 text-white px-4 py-3 rounded-md w-full text-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Create Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingForm;