"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaUser, 
    FaBox, 
    FaClock, 
    FaSignOutAlt,
    FaChevronRight,
    FaHome,
    FaMapMarkerAlt,
    FaCalendarAlt
} from 'react-icons/fa';

interface Assignment {
    id: string;
    dateTime: string;
    clientName: string;
    location: string;
    bookingStatus: string;
    packageName: string;
}

export default function StaffDashboard() {
    const router = useRouter();
    const [staffId, setStaffId] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [staffName, setStaffName] = useState<string>('');
    const [staffEmail, setStaffEmail] = useState<string>('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('email');
        
        if (!token || !email) {
            router.push('/login');
            return;
        }

        const fetchStaffId = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/staff/search?email=${encodeURIComponent(email)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch staff ID');
                }

                const staff = await response.json();
                if (!staff || !staff.id) {
                    throw new Error('Staff not found');
                }
                setStaffId(staff.id);
                setStaffName(staff.name);
                setStaffEmail(staff.email);
            } catch (error) {
                console.error('Error fetching staff ID:', error);
                setError('Failed to load staff information');
                setLoading(false);
            }
        };

        fetchStaffId();
    }, [router]);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!staffId) return;

            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/bookings/staff/${staffId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        sessionStorage.clear();
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch assignments');
                }

                const data = await response.json();
                const sortedAssignments = data.sort((a: Assignment, b: Assignment) => 
                    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                );
                setAssignments(sortedAssignments);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setError('Failed to load assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [staffId, router]);

    const handleLogout = () => {
        sessionStorage.clear();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ede7df] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b6a489]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#ede7df] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#2d2926] mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#b6a489] text-[#f7f6f2] rounded-md hover:bg-[#a08c6b] transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ede7df]">
            {/* Profile Section */}
            <div className="bg-[#f7f6f2] border-b border-[#e5e1da]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push(`/staff/staffprofile/${staffId}`)}
                                className="relative w-16 h-16 rounded-full overflow-hidden bg-[#ede7df] hover:bg-[#e5e1da] transition-colors duration-200"
                            >
                                <FaUser className="absolute inset-0 w-full h-full text-[#b6a489] p-4" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-serif text-[#2d2926]">{staffName}</h1>
                                <p className="text-[#2d2926]/70">{staffEmail}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center space-x-2 text-[#2d2926] hover:text-[#b6a489] transition-colors duration-200"
                            >
                                <FaHome />
                                <span>Home</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-[#2d2926] hover:text-[#b6a489] transition-colors duration-200"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-serif text-[#2d2926]">My Assignments</h2>
                    <p className="mt-2 text-[#2d2926]/70">Manage your upcoming photo shoots</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {assignments.length === 0 ? (
                        <div className="bg-[#f7f6f2] rounded-xl shadow-sm p-8 text-center border border-[#e5e1da]">
                            <FaCalendarAlt className="mx-auto h-12 w-12 text-[#b6a489]" />
                            <h3 className="mt-4 text-lg font-serif text-[#2d2926]">No assignments</h3>
                            <p className="mt-2 text-[#2d2926]/70">You don't have any upcoming photo shoots.</p>
                        </div>
                    ) : (
                        assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="bg-[#f7f6f2] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-[#e5e1da]"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <FaUser className="h-5 w-5 text-[#b6a489]" />
                                                <h3 className="text-lg font-serif text-[#2d2926]">
                                                    {assignment.clientName}
                                                </h3>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaClock className="h-5 w-5 text-[#b6a489]" />
                                                <p className="text-sm text-[#2d2926]/70">
                                                    {new Date(assignment.dateTime).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaMapMarkerAlt className="h-5 w-5 text-[#b6a489]" />
                                                <p className="text-sm text-[#2d2926]/70">{assignment.location}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaBox className="h-5 w-5 text-[#b6a489]" />
                                                <p className="text-sm text-[#2d2926]/70">{assignment.packageName}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                assignment.bookingStatus === 'upcoming'
                                                    ? 'bg-[#ede7df] text-[#b6a489]'
                                                    : 'bg-[#e5e1da] text-[#2d2926]'
                                            }`}>
                                                {assignment.bookingStatus}
                                            </span>
                                            <button className="flex items-center text-[#b6a489] hover:text-[#a08c6b] transition-colors duration-200">
                                                <span className="text-sm font-medium">View Details</span>
                                                <FaChevronRight className="ml-1 h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
} 