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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!staffData) return; // Don't submit if data is null

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
        // Loading state while fetching staff data
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Update Staff Details</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={staffData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={staffData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={staffData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={staffData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Experience:</label>
                    <input
                        type="text"
                        name="experience"
                        value={staffData.experience}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Hourly Rate (in LKR):</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={staffData.hourlyRate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Specialization:</label>
                    <input
                        type="text"
                        name="specialization"
                        value={staffData.specialization}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Availability:</label>
                    <select
                        name="availability"
                        value={staffData.availability.toString()}
                        onChange={handleChange}
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>
                <button type="submit">Update Staff</button>
            </form>
        </div>
    );
};

export default UpdateStaffPage;
