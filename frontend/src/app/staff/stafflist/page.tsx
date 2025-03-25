"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Staff } from "@/app/staff/types/staff"; // Import the correct Staff type
import { useRouter } from "next/navigation"; // Import the router for navigation

const AdminStaffList: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]); // State to hold the filtered staff list
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>(""); // State to hold the search input
    const router = useRouter();

    // Fetch the list of staff members
    useEffect(() => {
        const fetchStaffList = async () => {
            try {
                const response = await axios.get<Staff[]>("http://localhost:8080/api/staff");
                setStaffList(response.data);
                setFilteredStaff(response.data); // Initialize filtered staff with all staff
            } catch (err) {
                setError("Failed to fetch staff.");
                console.log(err);
            }
        };
        fetchStaffList();
    }, []);

    // Filter staff list based on search term
    useEffect(() => {
        const filtered = staffList.filter(
            (staff) =>
                staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.phone.includes(searchTerm)
        );
        setFilteredStaff(filtered);
    }, [searchTerm, staffList]);

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
            setFilteredStaff(response.data); // Update filtered list
        } catch (err) {
            setError("Failed to update availability.");
            console.log(err);
        }
    };

    // Handle Delete functionality
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");

        if (confirmDelete) {
            try {
                // Delete the staff member from the database
                await axios.delete(`http://localhost:8080/api/staff/${id}`);

                // Remove the staff member from the list
                setStaffList(staffList.filter(staff => staff.id !== id));
                setFilteredStaff(filteredStaff.filter(staff => staff.id !== id)); // Update filtered list

                alert("Staff deleted successfully!");
            } catch (err) {
                setError("Failed to delete staff.");
                console.log(err);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">BENI STAFF LIST</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            <table className="table-auto w-full mt-6 border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Name</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Email</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Phone</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Experience</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Hourly Rate</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Specialization</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Availability</th>
                    <th className="px-2 py-1 border border-gray-300 text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredStaff.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="text-center px-4 py-2 border border-gray-300 text-sm">
                            No staff members found.
                        </td>
                    </tr>
                ) : (
                    filteredStaff.map((staff) => (
                        <tr key={staff.id} className="text-sm">
                            <td className="px-2 py-1 border border-gray-300">{staff.name}</td>
                            <td className="px-2 py-1 border border-gray-300">{staff.email}</td>
                            <td className="px-2 py-1 border border-gray-300">{staff.phone}</td>
                            <td className="px-2 py-1 border border-gray-300">{staff.experience}</td>
                            <td className="px-2 py-1 border border-gray-300">{staff.hourlyRate}</td>
                            <td className="px-2 py-1 border border-gray-300">{staff.specialization}</td>
                            <td className="px-2 py-1 border border-gray-300">
                                <div className="flex justify-between items-center">
                                    <span>{staff.availability ? "Available" : "Busy"}</span>
                                    {staff.availability && (
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            onClick={() => updateAvailability(staff.id, !staff.availability)}
                                        >
                                            Assign to Booking
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="px-2 py-1 border border-gray-300 flex space-x-2">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => goToUpdatePage(staff.id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(staff.id)}
                                >
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
