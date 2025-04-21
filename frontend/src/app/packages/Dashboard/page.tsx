'use client'; // Important to mark this as a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import styles from './page.module.css'; // Ensure this path is correct
import { Package } from "@/app/packages/types/Package";
import {
    CameraIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    DocumentArrowDownIcon,
    WrenchScrewdriverIcon,
    CalendarDaysIcon,
    PhotoIcon,
    CheckIcon
} from "@heroicons/react/20/solid";

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState("");
    const [minPrice, setMinPrice] = useState<number | string>("");
    const [maxPrice, setMaxPrice] = useState<number | string>("");
    const router = useRouter();

    // Fetch packages from the backend (MongoDB)
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data);
                setFilteredPackages(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

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
    }, [searchName, minPrice, maxPrice]);

    const handleBooking = (pkg: Package) => {
        const query = new URLSearchParams({ packageName: pkg.name }).toString();
        router.push(`/bookings/create?${query}`);
    };

    const handleCustomizePackage = (pkg: Package) => {
        router.push(`/packages/Customize/${pkg.id}`);
    };

    // Generate PDF for each package
    const handleDownloadPDF = (pkg: Package) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text(pkg.name, 10, 10);
        doc.setFontSize(16);
        doc.text(`Package Type: ${pkg.packageType}`, 10, 20);
        doc.text(`Price: ${pkg.investment} LKR`, 10, 30);
        doc.text('Services Included:', 10, 40);
        pkg.servicesIncluded.forEach((service, index) => {
            doc.text(`${index + 1}. ${service}`, 10, 50 + (index * 10));
        });

        let yOffset = 50 + (pkg.servicesIncluded.length || 0) * 10;
        doc.text('Additional Items:', 10, yOffset);
        yOffset += 10;

        doc.text(`Edited Images: ${pkg.additionalItems.editedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Unedited Images: ${pkg.additionalItems.uneditedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;

        if (pkg.additionalItems.albums) {
            doc.text('Albums:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.albums.forEach((album, index) => {
                doc.text(`${index + 1}. Size: ${album.size}, Type: ${album.type}, Spread Count: ${album.spreadCount}`, 10, yOffset);
                yOffset += 10;
            });
        }

        if (pkg.additionalItems.framedPortraits) {
            doc.text('Framed Portraits:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.framedPortraits.forEach((portrait, index) => {
                doc.text(`${index + 1}. Size: ${portrait.size}, Quantity: ${portrait.quantity}`, 10, yOffset);
                yOffset += 10;
            });
        }

        doc.text(`Thank You Cards: ${pkg.additionalItems.thankYouCards || 'N/A'}`, 10, yOffset);

        // Save PDF
        doc.save(`${pkg.name || 'custom-package'}.pdf`);
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>Photography Packages</h1>

            {/* Filter Input Fields */}
            <div className={`${styles.filterSection} flex gap-4`}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className={styles.dashboardInput}
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={styles.dashboardInput}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={styles.dashboardInput}
                />
            </div>

            {/* List Available Packages */}
            <div className={styles.packageList}>
                {filteredPackages.length === 0 ? (
                    <div className={styles.noPackages}>No packages found</div>
                ) : (
                    filteredPackages.map((pkg) => (
                        <div key={pkg.id} className={styles.packageCard}>
                            <h3 className={styles.dashboardSubtitle}>{pkg.name}</h3>
                            <p className={styles.dashboardText}><strong>Type:</strong> {pkg.packageType}</p>
                            <p className={styles.dashboardText}><strong>Price:</strong> {pkg.investment} LKR</p>

                            {/* Package Details */}
                            <div className={styles.packageDetails}>
                                <h3 className={styles.dashboardSubtitle}>Services Included</h3>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.servicesIncluded?.map((service, index) => (
                                        <li key={index} className={styles.dashboardText}>{service}</li>
                                    )) || <li className={styles.dashboardText}>No services included</li>}
                                </ul>

                                <h3 className={styles.dashboardSubtitle}>Additional Items</h3>
                                <p className={styles.dashboardText}><strong>Edited Images:</strong> {pkg.additionalItems?.editedImages || 'N/A'}</p>
                                <p className={styles.dashboardText}><strong>Unedited Images:</strong> {pkg.additionalItems?.uneditedImages || 'N/A'}</p>

                                <h4 className={styles.dashboardSubtitleSmall}>Albums</h4>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.additionalItems?.albums?.map((album, index) => (
                                        <li key={index} className={styles.dashboardText}>
                                            {album.size} {album.type} (Spread Count: {album.spreadCount})
                                        </li>
                                    )) || <li className={styles.dashboardText}>No albums available</li>}
                                </ul>

                                <h4 className={styles.dashboardSubtitleSmall}>Framed Portraits</h4>
                                <ul className="list-disc pl-6 mb-4">
                                    {pkg.additionalItems?.framedPortraits?.map((portrait, index) => (
                                        <li key={index} className={styles.dashboardText}>
                                            {portrait.size} (Quantity: {portrait.quantity})
                                        </li>
                                    )) || <li className={styles.dashboardText}>No framed portraits available</li>}
                                </ul>

                                <p className={styles.dashboardText}><strong>Thank You Cards:</strong> {pkg.additionalItems?.thankYouCards || 'N/A'}</p>

                                {/* Buttons with layouts */}
                                <div className={styles.packageActions}>
                                    {/* Download PDF Button spanning full width */}
                                    <button
                                        onClick={() => handleDownloadPDF(pkg)}
                                        className={`${styles.dashboardButton} w-full bg-purple-500 text-white font-semibold py-3 rounded-md shadow hover:bg-purple-600 transition duration-200 ease-in-out flex items-center justify-center`}
                                    >
                                        Download PDF
                                    </button>

                                    {/* Book Now and Customize Buttons below */}
                                    <div className={styles.buttonContainer}>
                                        <button
                                            onClick={() => handleBooking(pkg)}
                                            className={`${styles.dashboardButton} ${styles.buttonBlue} flex-1`}
                                        >
                                            Book Now!
                                        </button>

                                        <Link
                                            href={`/packages/Customize/${pkg.id}`}
                                            onClick={() => handleCustomizePackage(pkg)}
                                            className={`${styles.dashboardButton} ${styles.buttonGreen} flex-1`}
                                        >
                                            <button>Customize Package</button>
                                        </Link>
                                    </div>
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
