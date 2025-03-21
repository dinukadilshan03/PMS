"use client"; // Important to mark this as a client component
import '@/app/globals.css';
import '@/app/packages/Dashboard/page.css';
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
}

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
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

    // Select a package for viewing details or customization
    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg); // Update selected package
    };

    if (loading) {
        return <div>Loading packages...</div>; // Show loading message while fetching data
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>

            {/* List Available Packages */}
            <h2 className="text-2xl mb-4">Available Packages</h2>
            <ul className="space-y-4">
                {packages.map((pkg) => (
                    <li
                        key={pkg.id}
                        className="bg-gray-100 p-4 rounded shadow-md cursor-pointer"
                        onClick={() => handleSelectPackage(pkg)}
                    >
                        <h3 className="text-xl font-semibold">{pkg.name}</h3>
                        <p><strong>Type:</strong> {pkg.packageType}</p>
                        <p><strong>Price:</strong> {pkg.investment} LKR</p>
                    </li>
                ))}
            </ul>

            {/* Display Selected Package Details */}
            {selectedPackage && (
                <div className="mt-8 flex gap-8">
                    <div className="w-1/2">
                        {/* Package Image (Placeholder, can be replaced with actual image URL) */}
                        <img
                            src="https://via.placeholder.com/400"
                            alt={selectedPackage.name}
                            className="w-full h-auto rounded shadow-lg"
                        />
                    </div>

                    <div className="w-1/2">
                        <h2 className="text-3xl font-semibold mb-4">{selectedPackage.name}</h2>

                        {/* Display Services Included */}
                        <h3 className="text-xl font-semibold mb-2">Photography Services Include</h3>
                        <ul className="list-disc pl-6 mb-4">
                            {selectedPackage.servicesIncluded.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>

                        {/* Display Additional Items */}
                        <h3 className="text-xl font-semibold mb-2">Additional Items</h3>
                        <div className="mb-4">
                            <p><strong>Edited Images:</strong> {selectedPackage.additionalItems.editedImages}</p>
                            <p><strong>Unedited Images:</strong> {selectedPackage.additionalItems.uneditedImages}</p>
                        </div>

                        {/* Display Albums */}
                        <h4 className="text-lg font-semibold mb-2">Albums</h4>
                        <ul className="list-disc pl-6 mb-4">
                            {selectedPackage.additionalItems.albums.map((album, index) => (
                                <li key={index}>
                                    {album.size} {album.type} (Spread Count: {album.spreadCount})
                                </li>
                            ))}
                        </ul>

                        {/* Display Framed Portraits */}
                        <h4 className="text-lg font-semibold mb-2">Framed Portraits</h4>
                        <ul className="list-disc pl-6 mb-4">
                            {selectedPackage.additionalItems.framedPortraits.map((portrait, index) => (
                                <li key={index}>
                                    {portrait.size} (Quantity: {portrait.quantity})
                                </li>
                            ))}
                        </ul>

                        {/* Display Thank You Cards */}
                        <p><strong>Thank You Cards:</strong> {selectedPackage.additionalItems.thankYouCards}</p>

                        {/* Display Price */}
                        <h3 className="text-xl font-semibold mt-4">Investment: {selectedPackage.investment} LKR</h3>

                        {/* Buttons to either select or customize */}
                        <div className="mt-4">
                            <button
                                onClick={() => alert(`Selected package: ${selectedPackage.name}`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Select Package
                            </button>
                            <button
                                onClick={() => alert(`Customizing package: ${selectedPackage.name}`)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Customize Package
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
