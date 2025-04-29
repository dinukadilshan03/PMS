"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCalendarAlt, FaMapMarkerAlt, FaBox, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

interface Assignment {
    id: string;
    dateTime: string;
    location: string;
    bookingStatus: 'upcoming' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    packageName: string;
    price: number;
    clientId: string;
    phoneNumber: string;
    email: string;
}

export default function StaffAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const staffId = searchParams.get('staffId');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                if (!staffId) {
                    setError('Staff ID not found');
                    setLoading(false);
                    return;
                }

                // Fetch bookings assigned to the staff member
                const response = await fetch(`http://localhost:8080/api/bookings/staff/${staffId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Unauthorized - clear session and redirect to login
                        sessionStorage.clear();
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch assignments');
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    // Sort assignments by date (most recent first)
                    const sortedAssignments = data.sort((a, b) => 
                        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                    );
                    setAssignments(sortedAssignments);
                } else {
                    setAssignments([]);
                }
            } catch (err) {
                setError('Failed to load assignments. Please try again later.');
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [router, staffId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'refunded':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/staff/dashboard')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
                    <button
                        onClick={() => router.push('/staff/dashboard')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {assignments.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You don't have any assignments at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {assignment.packageName}
                                        </h3>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.bookingStatus)}`}>
                                                {assignment.bookingStatus}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(assignment.paymentStatus)}`}>
                                                {assignment.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaCalendarAlt className="h-5 w-5 mr-2 text-indigo-500" />
                                                <span>Date: {new Date(assignment.dateTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaClock className="h-5 w-5 mr-2 text-indigo-500" />
                                                <span>Time: {new Date(assignment.dateTime).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaMapMarkerAlt className="h-5 w-5 mr-2 text-indigo-500" />
                                                <span>Location: {assignment.location}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaBox className="h-5 w-5 mr-2 text-indigo-500" />
                                                <span>Package: {assignment.packageName}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span>Price: LKR {assignment.price.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FaUser className="h-5 w-5 mr-2 text-indigo-500" />
                                                    <span>Client ID: {assignment.clientId}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FaPhone className="h-5 w-5 mr-2 text-indigo-500" />
                                                    <span>{assignment.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FaEnvelope className="h-5 w-5 mr-2 text-indigo-500" />
                                                    <span>{assignment.email}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/staff/assign/${assignment.id}`)}
                                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 