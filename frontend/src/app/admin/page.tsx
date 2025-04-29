"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
    totalBookings: number;
    pendingBookings: number;
    totalAlbums: number;
    totalStaff: number;
    totalPackages: number;
    totalPortfolioItems: number;
}

interface RecentActivity {
    id: string;
    type: string;
    description: string;
    userName: string;
    timestamp: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        pendingBookings: 0,
        totalAlbums: 0,
        totalStaff: 0,
        totalPackages: 0,
        totalPortfolioItems: 0,
    });

    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/dashboard/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        const fetchRecentActivities = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/dashboard/recent-activities');
                if (!response.ok) {
                    throw new Error('Failed to fetch recent activities');
                }
                const data = await response.json();
                setRecentActivities(data);
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        fetchStats();
        fetchRecentActivities();
    }, []);

    const stats_cards = [
        { name: 'Total Bookings', value: stats.totalBookings, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Pending Bookings', value: stats.pendingBookings, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Total Albums', value: stats.totalAlbums, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Total Staff', value: stats.totalStaff, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Total Packages', value: stats.totalPackages, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { name: 'Portfolio Items', value: stats.totalPortfolioItems, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'BOOKING':
                return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
            case 'ALBUM':
                return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
            case 'PORTFOLIO':
                return 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
            default:
                return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats_cards.map((card) => (
                    <div
                        key={card.name}
                        className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                    >
                        <dt>
                            <div className="absolute rounded-md bg-gray-800 p-3">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                </svg>
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{card.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {recentActivities.map((activity, index) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {index !== recentActivities.length - 1 && (
                                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActivityIcon(activity.type)} />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.description} by <span className="font-medium text-gray-900">{activity.userName}</span>
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time dateTime={activity.timestamp}>
                                                            {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}