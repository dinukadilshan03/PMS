'use client'; // Important to mark this as a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import'../Dashboard/page.css'
import {Package} from "@/app/packages/types/Package";

// // Define a package type interface
// interface Package {
//     id: string;
//     name: string;
//     investment: number;
//     packageType: string;
//     servicesIncluded: string[];
//     additionalItems: {
//         editedImages: string | null;
//         uneditedImages: string | null;
//         albums: Array<{
//             size: string;
//             type: string;
//             spreadCount: number;
//         }> | null;
//         framedPortraits: Array<{
//             size: string;
//             quantity: number;
//         }> | null;
//         thankYouCards: number | null;
//     };
//     image: string | null; // This will be the URL to the package image
// }

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]); // State to store filtered packages
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState(""); // For filtering by name
    const [minPrice, setMinPrice] = useState<number | string>(""); // For filtering by minimum price
    const [maxPrice, setMaxPrice] = useState<number | string>(""); // For filtering by maximum price
    const router = useRouter();

    // Fetch packages from the backend (MongoDB)
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data); // Update state with fetched packages
                setFilteredPackages(data); // Initially show all packages
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false); // Stop loading after fetch
            }
        };

        fetchPackages();
    }, []); // Only run on mount

    // Filter packages based on the name and price range
    const handleFilter = () => {
        let filtered = packages.filter((pkg) => {
            const matchesName = pkg.name.toLowerCase().includes(searchName.toLowerCase());
            const matchesMinPrice = minPrice ? pkg.investment >= +minPrice : true;
            const matchesMaxPrice = maxPrice ? pkg.investment <= +maxPrice : true;
            return matchesName && matchesMinPrice && matchesMaxPrice;
        });
        setFilteredPackages(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [searchName, minPrice, maxPrice]); // Trigger filter when the search or price changes

    const handleBooking = (pkg: Package) => {
        // No need to call useRouter here - it's already declared at component level
        const query = new URLSearchParams({ packageName: pkg.name }).toString();
        router.push(`/bookings/create?${query}`);
    };


    const handleCustomizePackage = (pkg: Package) => {
        alert(`Customizing package: ${pkg.name}`);
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

    if (loading) {
        return <div>Loading packages...</div>; // Show loading message while fetching data
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Photography Packages</h1>

            {/* Filter Input Fields */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>

            {/* List Available Packages */}
            <div className="package-list">
                {filteredPackages.length === 0 ? (
                    <div>No packages found</div>
                ) : (
                    filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="package-card p-4 cursor-pointer transform transition-all duration-300 ease-in-out scale-100">
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">{pkg.name}</h3>
                                <p><strong>Type:</strong> {pkg.packageType}</p>
                                <p><strong>Price:</strong> {pkg.investment} LKR</p>
                            </div>

                            {/* Always Display All Package Details */}
                            <div className="package-details mt-4">
                                <h3 className="text-xl font-semibold mb-2">Photography Services Include</h3>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.servicesIncluded?.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    )) || <li>No services included</li>}
                                </ul>

                                {/* Additional Items */}
                                <h3 className="text-xl font-semibold mb-2">Additional Items</h3>
                                <p><strong>Edited Images:</strong> {pkg.additionalItems?.editedImages || 'N/A'}</p>
                                <p><strong>Unedited Images:</strong> {pkg.additionalItems?.uneditedImages || 'N/A'}</p>

                                {/* Albums */}
                                <h4 className="text-lg font-semibold mb-2">Albums</h4>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.additionalItems?.albums?.map((album, index) => (
                                        <li key={index}>
                                            {album.size} {album.type} (Spread Count: {album.spreadCount})
                                        </li>
                                    )) || <li>No albums available</li>}
                                </ul>

                                {/* Framed Portraits */}
                                <h4 className="text-lg font-semibold mb-2">Framed Portraits</h4>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.additionalItems?.framedPortraits?.map((portrait, index) => (
                                        <li key={index}>
                                            {portrait.size} (Quantity: {portrait.quantity})
                                        </li>
                                    )) || <li>No framed portraits available</li>}
                                </ul>

                                {/* Thank You Cards */}
                                <p><strong>Thank You Cards:</strong> {pkg.additionalItems?.thankYouCards || 'N/A'}</p>

                                {/* Buttons */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleBooking(pkg)}
                                        className="btn btn-blue"
                                    >
                                        Book Now!
                                    </button>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <Link href={`/packages/Customize/${pkg.id}`} onClick={() => handleCustomizePackage(pkg)} className="btn btn-green">
                                        Customize
                                    </Link>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button
                                        onClick={() => handleDownloadPDF(pkg)}
                                        className="btn btn-purple"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
