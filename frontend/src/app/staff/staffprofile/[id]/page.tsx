"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const StaffProfilePage: React.FC = () => {
    const { id } = useParams();
    const [staffData, setStaffData] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/staff/${id}`);
                setStaffData(response.data);
            } catch (err) {
                setError("Failed to fetch staff data.");
                console.error(err);
            }
        };
        fetchStaffData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8080/api/staff/${id}`, staffData);
            if (res.status >= 200 && res.status < 300) {
                alert("Profile updated successfully!");
                setIsEditing(false);
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            alert("An error occurred while updating the profile.");
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStaffData({ ...staffData, [name]: value });
    };

    if (!staffData) {
        return <div className="text-center text-xl mt-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {staffData.name.split(' ')[0]}</h1>
                    <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Personal Information</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={staffData.name}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={staffData.email}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={staffData.phone}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={staffData.address}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Availability Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Availability</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                    <select
                                        name="availability"
                                        value={staffData.availability.toString()}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Busy</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Next Available Date</label>
                                    <input
                                        type="date"
                                        name="availabilityDate"
                                        value={staffData.availabilityDate ? staffData.availabilityDate.split('T')[0] : ""}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information View */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-lg">{staffData.name}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-lg">{staffData.email}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                    <p className="text-lg">{staffData.phone}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-lg">{staffData.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Availability View */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Availability</h2>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <p className="text-lg">
                                    {staffData.availability ? "Available" : "Busy"}
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-500">Next Available Date</p>
                                <p className="text-lg">
                                    {staffData.availabilityDate ?
                                        new Date(staffData.availabilityDate).toLocaleDateString('en-US') :
                                        "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffProfilePage;