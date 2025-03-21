"use client"; // Important to mark this as a client component

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
    const [totalPrice, setTotalPrice] = useState<number>(0);
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
            }
        };
        fetchPackages();
    }, []);

    // Select a package for viewing details or customization
    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg);
        setCustomizing(false); // Reset to default view
        updatePrice(pkg); // Update the price based on selected package
    };

    // Handle form submission to save the updated package
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedPackageData = {
            name: selectedPackage!.name,
            servicesIncluded: selectedPackage!.servicesIncluded,
            additionalItems: selectedPackage!.additionalItems,
            investment: selectedPackage!.investment,
            packageType: selectedPackage!.packageType,
        };

        try {
            const res = await fetch(`http://localhost:8080/api/packages/${selectedPackage!.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPackageData),
            });

            if (res.ok) {
                alert("Package updated successfully!");
                router.push("/"); // Redirect to homepage or package list
            } else {
                alert("Failed to update package.");
            }
        } catch (error) {
            alert("An error occurred while updating the package.");
            console.error(error);
        }
    };

    // Calculate the total price based on selected services, albums, etc.
    const updatePrice = (pkg: Package | null) => {
        if (pkg) {
            let price = pkg.investment;

            // Calculate price based on services
            price += pkg.servicesIncluded.length * 1000; // Example price per service

            // Calculate price based on albums and framed portraits
            pkg.additionalItems.albums.forEach(album => {
                price += album.spreadCount * 200; // Example price per album spread
            });

            pkg.additionalItems.framedPortraits.forEach(portrait => {
                price += portrait.quantity * 1500; // Example price per framed portrait
            });

            setTotalPrice(price);
        }
    };

    // Customize the selected package
    const handleCustomize = () => {
        setCustomizing(true); // Allow customization
    };

    const handleServiceChange = (index: number, value: string) => {
        const updatedServices = [...(selectedPackage?.servicesIncluded || [])];
        updatedServices[index] = value;
        setSelectedPackage({
            ...selectedPackage!,
            servicesIncluded: updatedServices,
        });
        updatePrice(selectedPackage);
    };

    const addService = () => setSelectedPackage({
        ...selectedPackage!,
        servicesIncluded: [...selectedPackage!.servicesIncluded, ""]
    });

    const removeService = (index: number) => {
        const updatedServices = selectedPackage!.servicesIncluded.filter((_, i) => i !== index);
        setSelectedPackage({ ...selectedPackage!, servicesIncluded: updatedServices });
        updatePrice(selectedPackage);
    };

    if (!selectedPackage) {
        return <div>Loading...</div>;
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
                        <p>{pkg.packageType}</p>
                        <p>Price: {pkg.investment} LKR</p>
                    </li>
                ))}
            </ul>

            {/* Display Selected Package Details */}
            {selectedPackage && (
                <div className="mt-8">
                    <h2 className="text-2xl mb-4">Package: {selectedPackage.name}</h2>

                    {/* Show customization options */}
                    {!customizing ? (
                        <div>
                            <button onClick={handleCustomize} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                                Customize This Package
                            </button>
                            <p>Price: {totalPrice} LKR</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Services Included:</label>
                                {selectedPackage.servicesIncluded.map((service, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => handleServiceChange(index, e.target.value)}
                                            className="p-2 border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeService(index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addService} className="text-blue-500">
                                    Add Service
                                </button>
                            </div>

                            <div>
                                <label>Albums:</label>
                                {selectedPackage.additionalItems.albums.map((album, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            value={album.size}
                                            onChange={(e) => {
                                                const updatedAlbums = [...selectedPackage!.additionalItems.albums];
                                                updatedAlbums[index].size = e.target.value;
                                                setSelectedPackage({
                                                    ...selectedPackage!,
                                                    additionalItems: { ...selectedPackage!.additionalItems, albums: updatedAlbums }
                                                });
                                                updatePrice(selectedPackage);
                                            }}
                                        />
                                        <input
                                            type="number"
                                            value={album.spreadCount}
                                            onChange={(e) => {
                                                const updatedAlbums = [...selectedPackage!.additionalItems.albums];
                                                updatedAlbums[index].spreadCount = parseInt(e.target.value);
                                                setSelectedPackage({
                                                    ...selectedPackage!,
                                                    additionalItems: { ...selectedPackage!.additionalItems, albums: updatedAlbums }
                                                });
                                                updatePrice(selectedPackage);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p>Total Price: {totalPrice} LKR</p>
                            </div>

                            <button type="submit">Save Changes</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
