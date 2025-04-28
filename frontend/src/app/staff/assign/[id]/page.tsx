"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Booking } from "@/app/bookings/types/booking";
import { Staff } from "@/app/staff/types/staff";

interface AssignStaffProps {
    params: {
        id: string;
    };
}

const AssignStaffToBooking: React.FC<AssignStaffProps> = ({ params }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [staff, setStaff] = useState<Staff | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [showNoBookingsAlert, setShowNoBookingsAlert] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch staff details
                const staffResponse = await axios.get<Staff>(`http://localhost:8080/api/staff/${params.id}`);
                setStaff(staffResponse.data);

                // Fetch all bookings
                const bookingsResponse = await axios.get<Booking[]>("http://localhost:8080/admin/bookings");
                setBookings(bookingsResponse.data);
            } catch (err) {
                setError("Failed to fetch data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    useEffect(() => {
        if (staff && bookings.length > 0) {
            const filtered = bookings.filter(booking => {
                const bookingDate = new Date(booking.dateTime);
                const startDate = new Date(staff.availabilityStartDate);
                const endDate = new Date(staff.availabilityEndDate);
                
                // Check if booking date falls within staff's availability range
                return bookingDate >= startDate && bookingDate <= endDate;
            });

            setFilteredBookings(filtered);

            // Only show alert if there are no bookings and we haven't shown it before
            if (filtered.length === 0 && !showNoBookingsAlert) {
                setShowNoBookingsAlert(true);
            } else if (filtered.length > 0) {
                // If there are bookings, don't show any alert
                setShowNoBookingsAlert(false);
            }
        }
    }, [staff, bookings, showNoBookingsAlert]);

    const handleAssign = async (bookingId: string) => {
        try {
            // Update the staff's assigned booking
            await axios.put(`http://localhost:8080/api/staff/${params.id}/assign`, {
                bookingId
            });

            // Update the booking's assigned staff
            await axios.put(`http://localhost:8080/api/bookings/${bookingId}/assign`, {
                staffId: params.id
            });

            alert("Staff assigned successfully!");
            router.push("/staff/stafflist");
        } catch (err) {
            setError("Failed to assign staff");
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!staff) return <div className="text-center p-4">Staff not found</div>;

    // Show modal if no bookings available
    if (showNoBookingsAlert) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">PhotoStudio</h2>
                        <p className="mb-6">No bookings available on this date for this photographer.</p>
                        <button
                            onClick={() => router.push("/staff/stafflist")}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
                Assign {staff.name} to a Booking
            </h1>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Available Bookings</h2>
                <table className="table-auto w-full mt-6 border-collapse border border-gray-300">
                    <thead>
                    <tr>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Date & Time</th>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Client</th>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Package</th>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Location</th>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Status</th>
                        <th className="px-2 py-1 border border-gray-300 text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBookings.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center px-4 py-2 border border-gray-300 text-sm">
                                No available bookings for this date.
                            </td>
                        </tr>
                    ) : (
                        filteredBookings.map((booking) => (
                            <tr key={booking.id} className="text-sm">
                                <td className="px-2 py-1 border border-gray-300">{new Date(booking.dateTime).toLocaleString()}</td>
                                <td className="px-2 py-1 border border-gray-300">{booking.email}</td>
                                <td className="px-2 py-1 border border-gray-300">{booking.packageName}</td>
                                <td className="px-2 py-1 border border-gray-300">{booking.location}</td>
                                <td className="px-2 py-1 border border-gray-300">{booking.bookingStatus}</td>
                                <td className="px-2 py-1 border border-gray-300">
                                    <button
                                        className={`px-3 py-1 text-white rounded ${
                                            booking.bookingStatus === "cancelled" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                                        }`}
                                        onClick={() => booking.bookingStatus !== "cancelled" && handleAssign(booking.id)}
                                        disabled={booking.bookingStatus === "cancelled"}
                                    >
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignStaffToBooking;