"use client";

import { useEffect, useState } from 'react';
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';
import "./page.css";
import "./globals.css"

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

    // Conditional check to ensure additionalItems is not null before rendering
    const renderAdditionalItems = (pkg: Package) => {
        if (pkg.additionalItems) {
            return (
                <>
                    <div>
                        <strong>Edited Images:</strong> {pkg.additionalItems.editedImages}
                    </div>
                    <div>
                        <strong>Unedited Images:</strong> {pkg.additionalItems.uneditedImages}
                    </div>
                    <div>
                        <strong>Albums:</strong>
                        <ul>
                            {pkg.additionalItems.albums?.map((album, index) => (
                                <li key={index}>
                                    {album.size} {album.type} (Spread Count: {album.spreadCount})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Framed Portraits:</strong>
                        <ul>
                            {pkg.additionalItems.framedPortraits?.map((portrait, index) => (
                                <li key={index}>
                                    {portrait.size} (Quantity: {portrait.quantity})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Thank You Cards:</strong> {pkg.additionalItems.thankYouCards}
                    </div>
                </>
            );
        } else {
            return <div>No additional items available</div>;
        }
    };

    // @ts-ignore
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Photography Packages</h1>

            {/* Create Package Link */}
            <Link href="/packages/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
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

                                {/* Render additional items safely */}
                                {renderAdditionalItems(pkg)}

                                <div className="mt-2 flex space-x-4">
                                    {/* Edit link */}
                                    <Link href={`/packages/edit/${pkg.id}`} className="text-blue-500">
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
