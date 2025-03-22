"use client"; // Important to mark this as a client component

import "../globals.css"; // Import global styles
import "../Dashboard/page.css"; // Import the custom Dashboard styles

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
    image: string;
}

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [customizing, setCustomizing] = useState<boolean>(false);

    const router = useRouter();

    // Fetch packages on component mount
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    // Select a package for viewing details
    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg);
        setCustomizing(false); // Reset to default view
    };

    const handleCustomize = () => {
        setCustomizing(true); // Allow customization
    };

    const handleSelect = () => {
        alert(`Selected Package: ${selectedPackage?.name}`);
        // You can navigate to a booking page or trigger another action here
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="heading">Customer Dashboard</h1>

            {/* List Available Packages */}
            <h2 className="subheading">Available Packages</h2>
            <div className="packages-container">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="package-card"
                        onClick={() => handleSelectPackage(pkg)}
                    >
                        <img src={pkg.image} alt={pkg.name} className="package-image" />
                        <div className="package-info">
                            <h3>{pkg.name}</h3>
                            <p>{pkg.packageType}</p>
                            <p>Price: {pkg.investment} LKR</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show Detailed Package Information */}
            {selectedPackage && (
                <div className="package-details">
                    <h3>Package Details: {selectedPackage.name}</h3>
                    <div className="package-details-container">
                        <div className="image-container">
                            <img
                                src={selectedPackage.image}
                                alt={selectedPackage.name}
                                className="details-image"
                            />
                        </div>

                        <div className="details-container">
                            <h4>Photography Services Include:</h4>
                            <ul className="details-list">
                                {selectedPackage.servicesIncluded.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>

                            <h4>Additional Items:</h4>
                            <p>
                                <strong>Edited Images:</strong> {selectedPackage.additionalItems.editedImages}
                            </p>
                            <p>
                                <strong>Unedited Images:</strong> {selectedPackage.additionalItems.uneditedImages}
                            </p>

                            <h4>Albums:</h4>
                            <ul>
                                {selectedPackage.additionalItems.albums.map((album, index) => (
                                    <li key={index}>
                                        {album.size} {album.type} (Spread Count: {album.spreadCount})
                                    </li>
                                ))}
                            </ul>

                            <h4>Framed Portraits:</h4>
                            <ul>
                                {selectedPackage.additionalItems.framedPortraits.map((portrait, index) => (
                                    <li key={index}>
                                        {portrait.size} (Quantity: {portrait.quantity})
                                    </li>
                                ))}
                            </ul>

                            <p>
                                <strong>Thank You Cards:</strong> {selectedPackage.additionalItems.thankYouCards}
                            </p>

                            <h4>Total Price: {selectedPackage.investment} LKR</h4>
                        </div>
                    </div>

                    {/* Select and Customize Buttons */}
                    <div className="buttons-container">
                        <button
                            onClick={handleSelect}
                            className="select-btn"
                        >
                            Select Package
                        </button>
                        <button
                            onClick={handleCustomize}
                            className="customize-btn"
                        >
                            Customize Package
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
