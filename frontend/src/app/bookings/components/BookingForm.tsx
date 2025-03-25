"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CreateBookingForm = () => {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [error, setError] = useState("");
    const [packages, setPackages] = useState<{id: string, name: string}[]>([]);

    // Fetch packages from backend
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };
        fetchPackages();
    }, []);

    // Set the selected package when page loads or packages change
    useEffect(() => {
        const packageName = searchParams?.get("packageName");
        if (packageName && packages.length > 0) {
            const exists = packages.some(pkg => pkg.name === packageName);
            if (exists) {
                setSelectedPackage(packageName);
            } else {
                console.warn(`Package "${packageName}" not found`);
            }
        }
    }, [searchParams, packages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Retrieve userId from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("You must be logged in to make a booking");
            return;
        }

        // Prepare the booking data
        const bookingData = {
            email,
            phoneNumber,
            location,
            packageName: selectedPackage,
            dateTime,
        };

        try {
            const response = await fetch("http://localhost:8080/api/bookings/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    userId: userId, // Add userId from localStorage to headers
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error("Booking limit reached for this day");
            }

            // Handle success
            alert("Booking created successfully!");
            setEmail("");
            setPhoneNumber("");
            setLocation("");
            setSelectedPackage("");
            setDateTime("");
        } catch (err) {
            setError("Error creating booking: " + err.message);
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
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select a package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.name}>
                                    {pkg.name}
                                </option>
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
