'use client'; // Important to mark this as a client component

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct import for dynamic routing
import { jsPDF } from "jspdf";  // Import jsPDF
import './page.css';

interface Package {
    id: string;
    name: string;
    investment: number;
    packageType: string;
    servicesIncluded: string[]; // List of services that are initially included
    additionalItems: {
        editedImages: string;
        uneditedImages: string;
        albums: Array<{
            size: string;
            type: string;
            spreadCount: number;
        }> | null;
        framedPortraits: Array<{
            size: string;
            quantity: number;
        }> | null;
        thankYouCards: number | null;
    };
    image: string | null; // Image URL or path
}

const CustomizePackage = () => {
    const { id } = useParams(); // useParams() to get the dynamic 'id'
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const servicePrice = 500; // Set the price increase when a service is selected

    useEffect(() => {
        // Fetch package data only if the `id` is available
        if (!id) return; // If `id` is undefined, skip the fetch

        const fetchPackageData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/packages/${id}`);
                const data = await response.json();
                setPackageData(data);
                setPrice(data.investment); // Set the initial price based on the fetched package data
            } catch (error) {
                console.error('Error fetching package data:', error);
            } finally {
                setLoading(false); // Stop loading once the fetch is done
            }
        };

        fetchPackageData();
    }, [id]); // Re-run when `id` changes

    // Handle price changes for removing services
    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: string) => {
        // Decrease price only when service is unchecked
        if (e.target.checked) {
            setPrice(prevPrice => prevPrice + servicePrice); // Increase price for adding service
        } else {
            setPrice(prevPrice => prevPrice - servicePrice); // Decrease price for removing service
        }
    };

    // Handle changes in quantity for framed portraits
    const handlePortraitChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedPortraits = [...packageData!.additionalItems.framedPortraits!];
        const newQuantity = Number(e.target.value);
        const prevQuantity = updatedPortraits[index].quantity;
        updatedPortraits[index].quantity = newQuantity;

        // Update the price based on the quantity change
        setPrice(price => price + (newQuantity - prevQuantity) * 50); // 50 LKR per portrait
        setPackageData({
            ...packageData!,
            additionalItems: {
                ...packageData!.additionalItems,
                framedPortraits: updatedPortraits
            }
        });
    };

    // Handle changes in number of Thank You Cards
    const handleThankYouCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedThankYouCards = Number(e.target.value);
        setPrice(price + (updatedThankYouCards - (packageData!.additionalItems.thankYouCards || 0)) * 50); // 50 LKR per card
        setPackageData({
            ...packageData!,
            additionalItems: {
                ...packageData!.additionalItems,
                thankYouCards: updatedThankYouCards
            }
        });
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text(packageData?.name || '', 10, 10);
        doc.setFontSize(16);

        // Package details
        doc.text(`Package Type: ${packageData?.packageType}`, 10, 20);
        doc.text(`Price: ${price} LKR`, 10, 30);

        // List services included
        doc.text('Services Included:', 10, 40);
        packageData?.servicesIncluded.forEach((service, index) => {
            doc.text(`${index + 1}. ${service}`, 10, 50 + (index * 10));
        });

        // Additional items
        let yOffset = 50 + (packageData?.servicesIncluded.length || 0) * 10;
        doc.text('Additional Items:', 10, yOffset);
        yOffset += 10;

        doc.text(`Edited Images: ${packageData?.additionalItems.editedImages}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Unedited Images: ${packageData?.additionalItems.uneditedImages}`, 10, yOffset);
        yOffset += 10;

        // Albums
        if (packageData?.additionalItems.albums) {
            doc.text('Albums:', 10, yOffset);
            yOffset += 10;
            packageData.additionalItems.albums.forEach((album, index) => {
                doc.text(`${index + 1}. Size: ${album.size}, Type: ${album.type}, Spread Count: ${album.spreadCount}`, 10, yOffset);
                yOffset += 10;
            });
        }

        // Framed Portraits
        if (packageData?.additionalItems.framedPortraits) {
            doc.text('Framed Portraits:', 10, yOffset);
            yOffset += 10;
            packageData.additionalItems.framedPortraits.forEach((portrait, index) => {
                doc.text(`${index + 1}. Size: ${portrait.size}, Quantity: ${portrait.quantity}`, 10, yOffset);
                yOffset += 10;
            });
        }

        // Thank You Cards
        doc.text(`Thank You Cards: ${packageData?.additionalItems.thankYouCards}`, 10, yOffset);

        // Save PDF
        doc.save(`${packageData?.name || 'custom-package'}.pdf`);
    };

    if (loading) return <div>Loading...</div>; // Return loading message if package data is not yet fetched
    if (!packageData) return <div>Package not found.</div>; // Handle case when no package is found for the id

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">{packageData.name} - Customize</h1>
            <p className="text-2xl text-center mb-4">Price: {price} LKR</p>

            {/* Customize services */}
            <h3 className="text-xl font-semibold mb-4">Services Included</h3>
            {packageData.servicesIncluded.map((service, index) => (
                <div key={index} className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        defaultChecked={true}  // Services are by default selected
                        onChange={(e) => handleServiceChange(e, service)} // When unchecked, price will decrease
                        className="mr-2"
                    />
                    <label>{service}</label>
                </div>
            ))}

            {/* Customize albums */}
            <h3 className="text-xl font-semibold mb-4">Albums</h3>
            {packageData.additionalItems.albums?.map((album, index) => (
                <div key={index} className="flex gap-4 mb-4">
                    <div>
                        <label>Size</label>
                        <input
                            type="text"
                            value={album.size}
                            onChange={(e) => {
                                const updatedAlbums = [...packageData.additionalItems.albums!];
                                updatedAlbums[index].size = e.target.value;
                                setPackageData({ ...packageData, additionalItems: { ...packageData.additionalItems, albums: updatedAlbums } });
                            }}
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Type</label>
                        <input
                            type="text"
                            value={album.type}
                            onChange={(e) => {
                                const updatedAlbums = [...packageData.additionalItems.albums!];
                                updatedAlbums[index].type = e.target.value;
                                setPackageData({ ...packageData, additionalItems: { ...packageData.additionalItems, albums: updatedAlbums } });
                            }}
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Spread Count</label>
                        <input
                            type="number"
                            value={album.spreadCount}
                            onChange={(e) => {
                                const updatedAlbums = [...packageData.additionalItems.albums!];
                                updatedAlbums[index].spreadCount = Number(e.target.value);
                                setPackageData({ ...packageData, additionalItems: { ...packageData.additionalItems, albums: updatedAlbums } });
                            }}
                            className="border p-2"
                        />
                    </div>
                </div>
            ))}

            {/* Customize framed portraits */}
            <h3 className="text-xl font-semibold mb-4">Framed Portraits</h3>
            {packageData.additionalItems.framedPortraits?.map((portrait, index) => (
                <div key={index} className="flex gap-4 mb-4">
                    <div>
                        <label>Size</label>
                        <input
                            type="text"
                            value={portrait.size}
                            onChange={(e) => {
                                const updatedPortraits = [...packageData.additionalItems.framedPortraits!];
                                updatedPortraits[index].size = e.target.value;
                                setPackageData({ ...packageData, additionalItems: { ...packageData.additionalItems, framedPortraits: updatedPortraits } });
                            }}
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={portrait.quantity}
                            onChange={(e) => handlePortraitChange(e, index)}  // Handle quantity change
                            className="border p-2"
                        />
                    </div>
                </div>
            ))}

            {/* Customize thank you cards */}
            <h3 className="text-xl font-semibold mb-4">Thank You Cards</h3>
            <input
                type="number"
                value={packageData.additionalItems.thankYouCards || ''}
                onChange={handleThankYouCardChange}  // Handle thank you card change
                className="border p-2"
            />

            <button className="mt-6 p-2 bg-blue-500 text-white rounded" onClick={handleDownloadPDF}>Download PDF</button>

            {/* Book Now Button */}
            <button className="mt-6 p-2 bg-green-500 text-white rounded">Book Now</button>
        </div>
    );
};

export default CustomizePackage;
