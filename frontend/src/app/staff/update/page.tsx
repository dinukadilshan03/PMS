"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // For getting the ID from the URL

const UpdateStaffDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;  // Getting staff ID from the URL

    const [staffData, setStaffData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        experience: "",
        hourlyRate: 0,
        specialization: "",
        availability: true,
    });

    useEffect(() => {
        if (id) {
            const fetchStaffData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/staff/${id}`);
                    const data = await response.json();
                    setStaffData(data);
                } catch (err) {
                    console.error("Failed to fetch staff data", err);
                }
            };

            fetchStaffData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStaffData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/staff/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(staffData),
            });

            if (response.ok) {
                alert("Staff details updated successfully!");
                router.push("/staff/list");  // Redirect to the staff list page
            } else {
                alert("Failed to update staff details");
            }
        } catch (err) {
            console.error("Error updating staff", err);
        }
    };

    return (
        <div>
            <h1>Update Staff Details</h1>
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
                    <label>Experience:</label>
                    <input
                        type="text"
                        name="experience"
                        value={staffData.experience}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hourly Rate:</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={staffData.hourlyRate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Specialization:</label>
                    <input
                        type="text"
                        name="specialization"
                        value={staffData.specialization}
                        onChange={handleChange}
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

export default UpdateStaffDetails;
