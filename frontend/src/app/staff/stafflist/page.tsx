"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Staff } from "@/app/staff/types/staff"; // Import the correct Staff type
import { useRouter } from "next/navigation"; // Import the router for navigation

const AdminStaffList: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    // Fetch the list of staff members
    useEffect(() => {
        const fetchStaffList = async () => {
            try {
                const response = await axios.get<Staff[]>("http://localhost:8080/api/staff");
                setStaffList(response.data);
            } catch (err) {
                setError("Failed to fetch staff.");
                console.log(err);
            }
        };
        fetchStaffList();
    }, []);

    // Redirect to update page
    const goToUpdatePage = (id: string) => {
        router.push(`/staff/update/${id}`);
    };

    // Toggle availability status
    const updateAvailability = async (id: string, availability: boolean) => {
        try {
            await axios.put(`http://localhost:8080/api/staff/availability/${id}`, {
                availability,
            });
            // Re-fetch the staff list after updating availability
            const response = await axios.get<Staff[]>("http://localhost:8080/api/staff");
            setStaffList(response.data);
        } catch (err) {
            setError("Failed to update availability.");
            console.log(err);
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border={1} style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Experience</th>
                    <th>Hourly Rate</th>
                    <th>Specialization</th>
                    <th>Availability</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {staffList.length === 0 ? (
                    <tr>
                        <td colSpan={8}>No staff members available.</td>
                    </tr>
                ) : (
                    staffList.map((staff) => (
                        <tr key={staff.id}>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.experience}</td>
                            <td>{staff.hourlyRate}</td>
                            <td>{staff.specialization}</td>
                            <td>
                                {staff.availability ? (
                                    <>
                                        <span style={{ marginRight: "10px" }}>Available</span>
                                        <button onClick={() => updateAvailability(staff.id, !staff.availability)}>
                                            Toggle Availability
                                        </button>
                                    </>
                                ) : (
                                    <span>Busy</span>
                                )}
                            </td>

                            <td>
                                {/* Update Staff */}
                                <button onClick={() => goToUpdatePage(staff.id)}>
                                    Update
                                </button>
                                {/* Delete Staff */}
                                <button onClick={() => {/* Delete logic here */}}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminStaffList;
