"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddStaffForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [experience, setExperience] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [availability, setAvailability] = useState(true);
    const router = useRouter();

    // Validate form fields
    const validateForm = () => {
        if (!name.trim()) {
            alert("Name is required.");
            return false;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email.");
            return false;
        }
        if (!phone.trim() || phone.length < 10) {
            alert("Please enter a valid phone number.");
            return false;
        }
        if (!address.trim()) {
            alert("Address is required.");
            return false;
        }
        if (!experience.trim()) {
            alert("Experience is required.");
            return false;
        }
        if (isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
            alert("Hourly rate must be a valid positive number.");
            return false;
        }
        if (!specialization.trim()) {
            alert("Specialization is required.");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const staffData = {
            name,
            email,
            phone,
            address,
            experience,
            hourlyRate: parseFloat(hourlyRate),
            specialization,
            availability,
        };

        try {
            const res = await fetch("http://localhost:8080/api/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(staffData),
            });

            if (res.ok) {
                alert("Staff added successfully!");
                router.push("/staff/stafflist"); // Redirect to the staff list page after success
            } else {
                alert("Failed to add staff.");
            }
        } catch (error) {
            alert("An error occurred while adding the staff.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Add New Staff Member</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Your Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Email Address:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter phone number"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter address"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Experience:</label>
                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter experience"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Hourly Rate (in LKR):</label>
                    <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        placeholder="Enter hourly rate"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Specialization:</label>
                    <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                        required
                    >
                        <option value="">Select Specialization</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Portraits">Portraits</option>
                        <option value="Events">Events</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700">Availability:</label>
                    <select
                        value={availability.toString()}
                        onChange={(e) => setAvailability(e.target.value === "true")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mt-1 text-xs"
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700 transition"
                >
                    Add Staff
                </button>
            </form>
        </div>
    );
};

export default AddStaffForm;
