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
    CheckIcon,
    PencilIcon,
    ShoppingCartIcon
} from "@heroicons/react/20/solid";
import Chatbot from '@/app/components/Chatbot';

const CustomerDashboard = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
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
        const filtered = packages.filter((pkg) => {
            const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice =
                (!minPrice || pkg.investment >= parseFloat(minPrice)) &&
                (!maxPrice || pkg.investment <= parseFloat(maxPrice));
            return matchesSearch && matchesPrice;
        });
        setFilteredPackages(filtered);
    }, [searchQuery, minPrice, maxPrice, packages]);

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

    const handleChatbotPackageSelect = (packageId: string) => {
        const selectedPackage = packages.find(pkg => pkg.id === packageId);
        if (selectedPackage) {
            handleBooking(selectedPackage);
        }
    };

    const handleChatbotCustomize = (packageId: string) => {
        const selectedPackage = packages.find(pkg => pkg.id === packageId);
        if (selectedPackage) {
            handleCustomize(selectedPackage);
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* <div className={styles.header}>
                <h1 className={styles.packageTitle}>Photography Packages</h1>
            </div> */}

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search packages..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className={styles.priceFilter}>
                    <input
                        type="number"
                        placeholder="Min price"
                        className={styles.priceInput}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="number"
                        placeholder="Max price"
                        className={styles.priceInput}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.packageList}>
                {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className={styles.packageCard}>
                        <div className={styles.packageCardContent}>
                            <CameraIcon className={styles.packageIcon} />
                            <h2 className={styles.packageTitle}>{pkg.name}</h2>
                            <div className={styles.packageType}>{pkg.packageType}</div>
                            <div className={styles.packagePrice}>{pkg.investment.toLocaleString()} LKR</div>
                            
                            <div className={styles.packageDetails}>
                                <div className={styles.additionalItems}>
                                    <div className={styles.additionalItemTitle}>Services Included:</div>
                                    <ul className={styles.servicesList}>
                                        {pkg.servicesIncluded?.map((service, index) => (
                                            <li key={index} className={styles.serviceItem}>
                                                <CheckIcon className="w-5 h-5" />
                                                <span>{service}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles.additionalItems}>
                                    <div className={styles.additionalItemTitle}>Additional Items:</div>
                                    <div className={styles.servicesList}>
                                        {pkg.additionalItems?.editedImages && (
                                            <div className={styles.serviceItem}>
                                                <PhotoIcon className="w-5 h-5" />
                                                <span>Edited Images: {pkg.additionalItems.editedImages}</span>
                                            </div>
                                        )}
                                        {pkg.additionalItems?.uneditedImages && (
                                            <div className={styles.serviceItem}>
                                                <CameraIcon className="w-5 h-5" />
                                                <span>Unedited Images: {pkg.additionalItems.uneditedImages}</span>
                                            </div>
                                        )}
                                        {pkg.additionalItems?.thankYouCards && (
                                            <div className={styles.serviceItem}>
                                                <DocumentArrowDownIcon className="w-5 h-5" />
                                                <span>Thank You Cards: {pkg.additionalItems.thankYouCards}</span>
                                            </div>
                                        )}
                                        {pkg.additionalItems?.albums?.map((album, index) => (
                                            <div key={index} className={styles.serviceItem}>
                                                <PhotoIcon className="w-5 h-5" />
                                                <span>Album: {album.size}, {album.type}, {album.spreadCount} spreads</span>
                                            </div>
                                        ))}
                                        {pkg.additionalItems?.framedPortraits?.map((portrait, index) => (
                                            <div key={index} className={styles.serviceItem}>
                                                <PhotoIcon className="w-5 h-5" />
                                                <span>Framed Portrait: {portrait.size}, Quantity: {portrait.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button
                                    onClick={() => handleBooking(pkg)}
                                    className={`${styles.button} ${styles.bookButton}`}
                                >
                                    <ShoppingCartIcon className="w-5 h-5" />
                                    Book Now
                                </button>
                                <button
                                    onClick={() => handleCustomize(pkg)}
                                    className={`${styles.button} ${styles.customizeButton}`}
                                >
                                    <PencilIcon className="w-5 h-5" />
                                    Customize
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.chatbotContainer}>
                <Chatbot 
                    onPackageSelect={handleChatbotPackageSelect}
                    onCustomize={handleChatbotCustomize}
                    packages={packages}
                />
            </div>
        </div>
    );
};

export default CustomerDashboard;
