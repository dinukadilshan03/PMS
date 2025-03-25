// /app/bookings/admin/pages/index.tsx
import React from "react";
import BookingTable from "@/app/bookings/admin/components/BookingTable";

const AdminBookingsPage = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Booking Management</h1>
            <BookingTable />
        </div>
    );
};

export default AdminBookingsPage;
