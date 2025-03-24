"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // For getting the ID from the URL
import { updateStaff, getStaffById } from "@/app/staff/utils/api"; // Import the API functions

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

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (id) {
            const fetchStaffData = async () => {
                try {
                    const data = await getStaffById(id as string); // Fetch staff details by ID
                    setStaffData(data);
                    setLoading(false);
                } catch (err) {
                    setError("Failed to fetch staff details");
                    setLoading(false);
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
            await updateStaff(id as string, staffData); // Send updated data to the backend
            alert("Staff details updated successfully!");
            router.push("/staff/list");  // Redirect to the staff list page
        } catch (err) {
            setError("Failed to update staff details");
        }
    };

    if (loading) {
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
