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

    const calculateSummary = () => {
        const totalStaff = filteredStaff.length;
        const availableStaff = filteredStaff.filter(staff => staff.availability).length;
        const totalHourlyRate = filteredStaff.reduce((sum, staff) => sum + (Number(staff.hourlyRate) || 0), 0);
        const averageHourlyRate = totalStaff ? (totalHourlyRate / totalStaff).toFixed(2) : "0.00";
        return { totalStaff, availableStaff, averageHourlyRate };
    };

    const summary = calculateSummary();

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const goToUpdatePage = (id: string) => {
        router.push(`/staff/update/${id}`);
    };

    const updateAvailability = async (id: string, availability: boolean) => {
        try {
            await axios.put(`http://localhost:8080/api/staff/availability/${id}`, { availability });
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

    const renderStatus = (staff: Staff) => {
        return (
            <div className="flex flex-col">
                <span className={staff.availability ? "text-green-600" : "text-red-600"}>
                    {staff.availability ? "Active" : "InActive"}
                </span>
                {staff.availabilityStartDate && staff.availabilityEndDate && (
                    <span className="text-xs text-gray-500">
                        {formatDate(staff.availabilityStartDate)} - {formatDate(staff.availabilityEndDate)}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">Employee</h1>
            <p className="text-gray-600 mb-6">Manage your staff members and their availability.</p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-bold text-blue-600">Available Photographer</div>
                        <div className="text-xl font-semibold">{summary.availableStaff}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-bold text-blue-600">Total Staff</div>
                        <div className="text-xl font-semibold">{summary.totalStaff}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-bold text-blue-600">Average Base Rate</div>
                        <div className="text-xl font-semibold">${summary.averageHourlyRate}/hr</div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setViewMode('table')}
                    >
                        Table View
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm w-full"
                    />
                    <button
                        className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 whitespace-nowrap w-full md:w-auto"
                        onClick={() => router.push('/staff/add')}
                    >
                        Add New Staff
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {viewMode === 'table' ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="w-full">
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
                        <tbody className="divide-y divide-gray-200">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No staff members found.
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{staff.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{staff.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{staff.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {staff.experience || "N/A"} {staff.experience ? "years" : ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">${staff.hourlyRate}/hr</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderStatus(staff)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button
                                            className={`px-3 py-1 rounded text-xs ${staff.availability ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                                            onClick={() => staff.availability && handleAssignToPhotographer(staff.id)}
                                            disabled={!staff.availability}
                                        >
                                            Assign
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                            onClick={() => goToUpdatePage(staff.id)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
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
                            <div key={staff.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-1">{staff.name}</h3>
                                    <p className="text-sm text-gray-500 mb-1">{staff.email}</p>
                                    <p className="text-sm text-gray-500 mb-1">{staff.phone}</p>
                                    <div className="flex justify-between text-sm mt-3">
                                        <span className="text-gray-500">Exp: {staff.experience || "N/A"} {staff.experience ? "yrs" : ""}</span>
                                        <span className="font-medium">${staff.hourlyRate}/hr</span>
                                    </div>
                                    <div className="mt-3">
                                        {renderStatus(staff)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 flex justify-between">
                                    <button
                                        className={`text-xs px-3 py-1 rounded ${staff.availability ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                                        onClick={() => staff.availability && handleAssignToPhotographer(staff.id)}
                                        disabled={!staff.availability}
                                    >
                                        Assign
                                    </button>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            onClick={() => goToUpdatePage(staff.id)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={() => handleDelete(staff.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
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