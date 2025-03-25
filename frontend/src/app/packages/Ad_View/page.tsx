"use client";

import { useEffect, useState } from 'react';
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "../Ad_View/page.css";
import "../globals.css";

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
                <div className="mt-4">
                    <div className="feature">
                        <strong>Edited Images:</strong> {pkg.additionalItems.editedImages}
                    </div>
                    <div className="feature">
                        <strong>Unedited Images:</strong> {pkg.additionalItems.uneditedImages}
                    </div>
                    <div className="feature">
                        <strong>Albums:</strong>
                        <ul className="list-disc pl-6">
                            {pkg.additionalItems.albums?.map((album, index) => (
                                <li key={index}>
                                    {album.size} {album.type} (Spread Count: {album.spreadCount})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="feature">
                        <strong>Framed Portraits:</strong>
                        <ul className="list-disc pl-6">
                            {pkg.additionalItems.framedPortraits?.map((portrait, index) => (
                                <li key={index}>
                                    {portrait.size} (Quantity: {portrait.quantity})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="feature">
                        <strong>Thank You Cards:</strong> {pkg.additionalItems.thankYouCards}
                    </div>
                </div>
            );
        } else {
            return <div>No additional items available</div>;
        }
    };

    // Generate PDF for each package
    const handleDownloadPDF = (pkg: Package) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text(pkg.name, 10, 10);
        doc.setFontSize(16);

        // Package details
        doc.text(`Package Type: ${pkg.packageType}`, 10, 20);
        doc.text(`Price: ${pkg.investment} LKR`, 10, 30);

        // List services included
        doc.text('Services Included:', 10, 40);
        pkg.servicesIncluded.forEach((service, index) => {
            doc.text(`${index + 1}. ${service}`, 10, 50 + (index * 10));
        });

        // Additional items
        let yOffset = 50 + (pkg.servicesIncluded.length || 0) * 10;
        doc.text('Additional Items:', 10, yOffset);
        yOffset += 10;

        doc.text(`Edited Images: ${pkg.additionalItems.editedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Unedited Images: ${pkg.additionalItems.uneditedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;

        // Albums
        if (pkg.additionalItems.albums) {
            doc.text('Albums:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.albums.forEach((album, index) => {
                doc.text(`${index + 1}. Size: ${album.size}, Type: ${album.type}, Spread Count: ${album.spreadCount}`, 10, yOffset);
                yOffset += 10;
            });
        }

        // Framed Portraits
        if (pkg.additionalItems.framedPortraits) {
            doc.text('Framed Portraits:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.framedPortraits.forEach((portrait, index) => {
                doc.text(`${index + 1}. Size: ${portrait.size}, Quantity: ${portrait.quantity}`, 10, yOffset);
                yOffset += 10;
            });
        }

        // Thank You Cards
        doc.text(`Thank You Cards: ${pkg.additionalItems.thankYouCards || 'N/A'}`, 10, yOffset);

        // Save PDF
        doc.save(`${pkg.name || 'custom-package'}.pdf`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Photography Packages</h1>

            {/* Create Package Link */}
            <Link href="/packages/create" className="bg-blue-500 text-white px-6 py-3 rounded mb-6 inline-block hover:bg-blue-700 transition">
                Create Package
            </Link>

            {/* Show Loading Spinner while fetching */}
            {loading ? (
                <p className="text-center">Loading packages...</p>
            ) : (
                <ul className="space-y-6">
                    {packages.length === 0 ? (
                        <li className="text-center">No packages available.</li>
                    ) : (
                        packages.map((pkg) => (
                            <li key={pkg.id} className="package-card p-6 bg-gray-100 rounded-lg shadow-lg">
                                <div className="package-header mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">{pkg.name}</h2>
                                    <p className="text-xl text-gray-600">Price: {pkg.investment} LKR</p>
                                    <p className="text-lg text-gray-600">{pkg.packageType}</p>
                                </div>

                                {/* Render additional items safely */}
                                {renderAdditionalItems(pkg)}

                                {/* Action Buttons */}
                                <div className="package-actions mt-6 flex justify-between space-x-6">
                                    <Link href={`/packages/edit/${pkg.id}`} className="btn-edit text-blue-500 hover:text-blue-700 transition">
                                        Edit
                                    </Link>

                                    <div className="flex space-x-4">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="btn-delete text-red-500 hover:text-red-700 transition"
                                        >
                                            Delete
                                        </button>

                                        {/* Add Download PDF Button */}
                                        <button
                                            onClick={() => handleDownloadPDF(pkg)}
                                            className="btn-download text-purple-500 hover:text-purple-700 transition"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
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
