"use client"
import React, { useState } from 'react';

const StaffProfile: React.FC = () => {
    // Assuming `staffData` and `isAdmin` come from state or props
    const [staffData, setStaffData] = useState({
        availability: true, // or false based on initial state
    });
    const isAdmin = true; // This should come from a prop or context

    // Handle change for form fields
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStaffData({
            ...staffData,
            availability: e.target.value === 'true' ? true : false,
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted", staffData);
        // Add logic to update the staff profile here
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Availability:</label>
                    <select
                        name="availability"
                        value={staffData.availability.toString()} // Ensure it's a string for the value
                        onChange={handleChange}
                        disabled={isAdmin} // Admin can't change availability
                    >
                        <option value="true">Available</option>
                        <option value="false">Busy</option>
                    </select>
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default StaffProfile;
