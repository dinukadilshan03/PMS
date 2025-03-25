import React from "react";
import BookingTable from "@/app/bookings/admin/components/BookingTable";

const AdminBookingsPage = () => {
    return (
        <div className="min-h-screen bg-amber-200 p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Admin Booking Management</h1>
                <BookingTable />
            </div>
        </div>
    );
};

export default AdminBookingsPage;
