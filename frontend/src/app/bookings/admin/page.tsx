import React from "react";
import BookingTable from "@/app/bookings/admin/components/BookingTable";

const AdminBookingsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:px-8 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Booking Management</h1>
                                <p className="mt-2 text-sm text-gray-600">Manage and track all photography session bookings</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    Admin Dashboard
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-8 sm:px-8">
                        <BookingTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingsPage;