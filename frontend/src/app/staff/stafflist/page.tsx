"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Staff } from "@/app/staff/types/staff";
import { useRouter } from "next/navigation";

const AdminStaffList: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const router = useRouter();

    useEffect(() => {
        const fetchStaffList = async () => {
            try {
                const response = await axios.get<Staff[]>("http://localhost:8080/api/staff");
                setStaffList(response.data);
                setFilteredStaff(response.data);
            } catch (err) {
                setError("Failed to fetch staff.");
                console.log(err);
            }
        };
        fetchStaffList();
    }, []);

    useEffect(() => {
        const filtered = staffList.filter(
            (staff) =>
                staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.phone.includes(searchTerm)
        );
        setFilteredStaff(filtered);
    }, [searchTerm, staffList]);

    const goToUpdatePage = (id: string) => {
        router.push(`/staff/update/${id}`);
    };

    const updateAvailability = async (id: string, availability: boolean) => {
        try {
            await axios.put(`http://localhost:8080/api/staff/availability/${id}`, {
                availability,
            });
            const response = await axios.get<Staff[]>("http://localhost:8080/api/staff");
            setStaffList(response.data);
            setFilteredStaff(response.data);
        } catch (err) {
            setError("Failed to update availability.");
            console.log(err);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/api/staff/${id}`);
                setStaffList(staffList.filter(staff => staff.id !== id));
                setFilteredStaff(filteredStaff.filter(staff => staff.id !== id));
                alert("Staff deleted successfully!");
            } catch (err) {
                setError("Failed to delete staff.");
                console.log(err);
            }
        }
    };

    const handleAssignToPhotographer = (id: string) => {
        router.push(`/staff/assign/${id}`);
    };

    const getStatusDot = (availability: boolean) => {
        return availability ? "▪ Active" : "▪ InActive";
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">Employee</h1>
            <p className="text-gray-600 mb-6">Manage your staff members and their availability.</p>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Employee List</h2>
                <div className="flex space-x-4 mb-6">
                    <span className="text-gray-600">All Staff</span>
                    <span className="text-gray-600">Availability</span>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table View
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
                    />
                    <button
                        className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
                        onClick={() => router.push('/staff/add')}
                    >
                        Add New Staff
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {viewMode === 'table' ? (
                <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No staff members found.
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {staff.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {staff.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {staff.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {staff.experience} {staff.experience ? "years" : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${staff.hourlyRate}/hr
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getStatusDot(staff.availability)}
                                        {staff.availabilityDate && (
                                            <span className="block text-xs text-gray-400">
                                                    {new Date(staff.availabilityDate).toLocaleDateString()}
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                                        <button
                                            className={`px-3 py-1 text-xs rounded ${staff.availability ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                                            onClick={() => staff.availability && handleAssignToPhotographer(staff.id)}
                                            disabled={!staff.availability}
                                        >
                                            Assign
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                            onClick={() => goToUpdatePage(staff.id)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-4">
                            No staff members found.
                        </div>
                    ) : (
                        filteredStaff.map((staff) => (
                            <div key={staff.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{staff.name}</h3>
                                        <p className="text-gray-600 text-sm">{staff.email}</p>
                                    </div>
                                    <span className={`text-xs ${staff.availability ? "text-green-500" : "text-gray-500"}`}>
                                        {getStatusDot(staff.availability)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm">{staff.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Specialization</p>
                                        <p className="text-sm">{staff.specialization || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Experience</p>
                                        <p className="text-sm">{staff.experience} {staff.experience ? "years" : ""}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Hourly Rate</p>
                                        <p className="text-sm">${staff.hourlyRate}/hr</p>
                                    </div>
                                </div>
                                {staff.availabilityDate && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500">Available Date</p>
                                        <p className="text-sm">{new Date(staff.availabilityDate).toLocaleDateString()}</p>
                                    </div>
                                )}
                                <div className="flex space-x-2">
                                    <button
                                        className={`flex-1 px-3 py-1 text-xs rounded ${staff.availability ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                                        onClick={() => staff.availability && handleAssignToPhotographer(staff.id)}
                                        disabled={!staff.availability}
                                    >
                                        Assign
                                    </button>
                                    <button
                                        className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                        onClick={() => goToUpdatePage(staff.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="flex-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                        onClick={() => handleDelete(staff.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminStaffList;