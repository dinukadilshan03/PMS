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
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const router = useRouter();

    // Fetch packages from the backend
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

    // Filter packages based on search and price range
    useEffect(() => {
        let filtered = packages.filter((pkg) => {
            const matchesName = pkg.name.toLowerCase().includes(searchName.toLowerCase());
            const matchesMinPrice = minPrice ? pkg.investment >= +minPrice : true;
            const matchesMaxPrice = maxPrice ? pkg.investment <= +maxPrice : true;
            return matchesName && matchesMinPrice && matchesMaxPrice;
        });
        setFilteredPackages(filtered);
    }, [searchName, minPrice, maxPrice, packages]);

    const handleBooking = (pkg: Package) => {
        router.push(`/bookings/create?packageName=${encodeURIComponent(pkg.name)}`);
    };

    const handleCustomize = (pkg: Package) => {
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

            <div className={styles.filterSection}>
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

            <div className={styles.packageList}>
                {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className={styles.packageCard}>
                        <h2 className={styles.packageTitle}>{pkg.name}</h2>
                        <div className={styles.packagePrice}>{pkg.investment} LKR</div>
                        <div className={styles.packageType}>{pkg.packageType}</div>

                        <div className={styles.sectionTitle}>Services Included:</div>
                        <ul className={styles.servicesList}>
                            {pkg.servicesIncluded?.map((service, index) => (
                                <li key={index} className={styles.serviceItem}>
                                    {service}
                                </li>
                            ))}
                        </ul>

                        <div className={styles.sectionTitle}>Edited Images:</div>
                        <div>{pkg.additionalItems?.editedImages || 'Edited Images On Pen Drive'}</div>

                        <div className={styles.sectionTitle}>Unedited Images:</div>
                        <div>{pkg.additionalItems?.uneditedImages || 'All Unedited Images'}</div>

                        <div className={styles.buttonContainer}>
                            <button
                                onClick={() => handleBooking(pkg)}
                                className={styles.bookButton}
                            >
                                Book Now
                            </button>
                            <button
                                onClick={() => handleCustomize(pkg)}
                                className={styles.customizeButton}
                            >
                                Customize
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerDashboard;
