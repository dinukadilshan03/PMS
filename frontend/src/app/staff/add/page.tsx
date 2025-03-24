"use client"
import React, { useState } from "react";
import axios from "axios";

const AddStaffForm = () => {
    const [staffData, setStaffData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        experience: "",
        hourlyRate: "",
        specialization: "", // Changed to empty string initially
        availability: true, // Default to Available
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStaffData({
            ...staffData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post("http://localhost:8080/api/staff", staffData)
            .then((response) => {
                alert("Staff added successfully!");
                window.location.href = "/staff-list"; // Redirect after success
            })
            .catch((error) => console.error("Error adding staff", error));
    };

    return (
        <div className="form-container">
            <h2>Add New Staff Member</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={staffData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={staffData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={staffData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Enter Address"
                        value={staffData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="experience">Experience:</label>
                    <input
                        type="text"
                        name="experience"
                        placeholder="Enter Experience"
                        value={staffData.experience}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate:</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        placeholder="Enter Hourly Rate"
                        value={staffData.hourlyRate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="specialization">Specialization:</label>
                    <select
                        name="specialization"
                        value={staffData.specialization}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Specialization</option>
                        <option value="Portraits">Portraits</option>
                        <option value="Weddings">Weddings</option>
                        <option value="Events">Events</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="availability">Availability:</label>
                    <select
                        name="availability"
                        value={staffData.availability.toString()} // Ensure the value is string type
                        onChange={handleChange}
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
