"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use correct import for router in Next.js

const AddStaffForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [experience, setExperience] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [availability, setAvailability] = useState(true); // Availability is a boolean
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
            hourlyRate: parseFloat(hourlyRate), // Convert hourly rate to a number
            specialization,
            availability, // Availability is already a boolean
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
        <div>
            <h1>Add New Staff Member</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Experience:</label>
                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Hourly Rate (in LKR):</label>
                    <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Specialization:</label>
                    <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Availability:</label>
                    <select
                        value={availability.toString()}
                        onChange={(e) => setAvailability(e.target.value === "true")}
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>

                <button type="submit">Add Staff</button>
            </form>
        </div>
    );
};

export default AddStaffForm;
