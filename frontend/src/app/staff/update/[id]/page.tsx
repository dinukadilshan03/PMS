"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios"; // Use for routing

const UpdateStaffPage: React.FC = () => {
    const { id } = useParams(); // Get the staff ID from the URL
    const [staffData, setStaffData] = useState<any>(null); // Initialize as null
    const [error, setError] = useState<string>("");
    const router = useRouter();

    // Fetch staff data on page load
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/staff/${id}`);
                setStaffData(response.data); // Populate the form fields with staff data
            } catch (err) {
                setError("Failed to fetch staff data.");
                console.error(err);
            }
        };
        fetchStaffData();
    }, [id]);

    // Validate form fields
    const validateForm = () => {
        if (!staffData.name.trim()) {
            alert("Name is required.");
            return false;
        }
        if (!staffData.email.trim() || !/\S+@\S+\.\S+/.test(staffData.email)) {
            alert("Please enter a valid email.");
            return false;
        }
        if (!/^\d{10}$/.test(staffData.phone)) {
            alert("Phone number must be exactly 10 digits and contain only numbers.");
            return false;
        }
        if (!staffData.address.trim()) {
            alert("Address is required.");
            return false;
        }
        if (!staffData.experience.trim()) {
            alert("Experience is required.");
            return false;
        }
        if (isNaN(Number(staffData.hourlyRate)) || Number(staffData.hourlyRate) <= 0) {
            alert("Hourly rate must be a valid positive number.");
            return false;
        }
        if (!staffData.specialization.trim()) {
            alert("Specialization is required.");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!staffData || !validateForm()) return; // Don't submit if data is null or invalid

        try {
            const res = await axios.put(`http://localhost:8080/api/staff/${id}`, staffData);

            if (res.status >= 200 && res.status < 300) {
                alert("Staff updated successfully!");
                router.push("/staff/stafflist"); // Redirect to staff list page
            } else {
                alert("Failed to update staff.");
            }
        } catch (error) {
            alert("An error occurred while updating the staff.");
            console.error(error);
        }
    };

    // Handle field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStaffData({ ...staffData, [name]: value });
    };

    if (!staffData) {
        // Loading state
        return <div className="text-center text-xl mt-10">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Update Staff Details</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={staffData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={staffData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={staffData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={staffData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Experience:</label>
                    <input
                        type="text"
                        name="experience"
                        value={staffData.experience}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Hourly Rate (in LKR):</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={staffData.hourlyRate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Specialization:</label>
                    <input
                        type="text"
                        name="specialization"
                        value={staffData.specialization}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Availability:</label>
                    <select
                        name="availability"
                        value={staffData.availability.toString()}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Availability Date:</label>
                    <input
                        type="date"
                        name="availabilityDate"
                        value={staffData.availabilityDate || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700 mt-4"
                >
                    Update Staff
                </button>
            </form>
        </div>
    );
};

export default UpdateStaffPage;
