"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios"; // Use for routing

const StaffProfilePage: React.FC = () => {
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
        if (!/^[0-9]{10}$/.test(staffData.phone)) {
            alert("Phone number must be exactly 10 digits and contain only numbers.");
            return false;
        }
        if (!staffData.address.trim()) {
            alert("Address is required.");
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
                router.push(`/staff/staffprofile/${id}`); // Redirect to staff profile page
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
        // Loading state while fetching staff data
        return <div className="text-center text-xl mt-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Staff Profile</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={staffData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={staffData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={staffData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={staffData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Availability:</label>
                    <select
                        name="availability"
                        value={staffData.availability.toString()}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default StaffProfilePage;
