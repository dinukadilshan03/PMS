"use client";

import { useEffect, useState } from 'react';
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';

const HomePage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackages();
                setPackages(data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deletePackage(id); // Deleting the package
            setPackages(packages.filter((pkg) => pkg.id !== id)); // Remove from the state
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    // @ts-ignore
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Photography Packages</h1>

            {/* Create Package Link */}
            <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                Create Package
            </Link>

            {/* Show Loading Spinner while fetching */}
            {loading ? (
                <p>Loading packages...</p>
            ) : (
                <ul className="space-y-4">
                    {packages.length === 0 ? (
                        <li>No packages available.</li>
                    ) : (
                        packages.map((pkg) => (
                            <li key={pkg.id} className="bg-gray-100 p-4 rounded shadow-md">
                                <h2 className="text-xl font-semibold">{pkg.name}</h2>
                                <p>{pkg.description}</p>
                                <p>Price: {pkg.investment} LKR</p>
                                <p>Status: {pkg.packageType}</p>

                                <div className="mt-2 flex space-x-4">
                                    {/* Edit link */}
                                    <Link href={`/edit/${pkg.id}`} className="text-blue-500">
                                        Edit
                                    </Link>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
