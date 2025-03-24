"use client"; // Important to mark this as a client component

import '../globals.css'; // Include Tailwind CSS or any global styles
import '../Dashboard/page.css';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define a package type interface
interface Package {
    id: string;
    name: string;
    investment: number;
    packageType: string;
    servicesIncluded: string[];
    additionalItems: {
        editedImages: string;
        uneditedImages: string;
        albums: Array<{
            size: string;
            type: string;
            spreadCount: number;
        }>;
        framedPortraits: Array<{
            size: string;
            quantity: number;
        }>;
        thankYouCards: number;
    };
    image: string; // This will be the URL to the package image
}

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState<string | null>(null);
    const router = useRouter();

    // Fetch packages from the backend (MongoDB)
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data); // Update state with fetched packages
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false); // Stop loading after fetch
            }
        };

        fetchPackages();
    }, []); // Only run on mount

    // Toggle the expanded package on click
    const handleToggleExpand = (pkgId: string) => {
        if (isExpanded === pkgId) {
            setIsExpanded(null); // Collapse the package if it's already expanded
        } else {
            setIsExpanded(pkgId); // Expand the clicked package
        }
    };

    // Handle Add to Cart and Customize actions
    const handleAddToCart = (pkg: Package) => {
        alert(`Added ${pkg.name} to the cart!`);
    };

    const handleCustomizePackage = (pkg: Package) => {
        alert(`Customizing package: ${pkg.name}`);
    };

    if (loading) {
        return <div>Loading packages...</div>; // Show loading message while fetching data
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Photography Packages</h1>

            {/* List Available Packages */}
            <div className="package-list">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`package-card p-4 cursor-pointer transform transition-all duration-300 ease-in-out ${
                            isExpanded === pkg.id ? "scale-105" : "scale-100"
                        }`}
                        onClick={() => handleToggleExpand(pkg.id)}
                    >
                        <img
                            src={'/images/pic.jpg'}  // Use the image URL from MongoDB
                            alt={pkg.name}
                            className="package-image"
                        />
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold">{pkg.name}</h3>
                            <p><strong>Type:</strong> {pkg.packageType}</p>
                            <p><strong>Price:</strong> {pkg.investment} LKR</p>
                        </div>

                        {/* Expanded Package Details */}
                        {isExpanded === pkg.id && (
                            <div className="package-details mt-4 transition-all duration-300 ease-in-out">
                                <h3 className="text-xl font-semibold mb-2">Photography Services Include</h3>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.servicesIncluded.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    ))}
                                </ul>

                                {/* Additional Items */}
                                <h3 className="text-xl font-semibold mb-2">Additional Items</h3>
                                <p><strong>Edited Images:</strong> {pkg.additionalItems.editedImages}</p>
                                <p><strong>Unedited Images:</strong> {pkg.additionalItems.uneditedImages}</p>

                                {/* Buttons */}
                                <div className="mt-4 flex gap-4">
                                    <button
                                        onClick={() => handleAddToCart(pkg)}
                                        className="btn btn-blue"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleCustomizePackage(pkg)}
                                        className="btn btn-green"
                                    >
                                        Customize Package
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerDashboard;
