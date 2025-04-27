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
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Colors
        const colorBackground = '#e2dacf';
        const colorSurface = '#f7f6f2';
        const colorText = '#2d2926';
        const colorAccent = '#b6a489';
        const colorBorder = '#e5e1da';

        // HEADER
        doc.setFillColor(colorBackground);
        doc.rect(0, 0, pageWidth, 70, 'F');
        doc.setFontSize(22);
        doc.setTextColor(colorText);
        doc.setFont('helvetica', 'bold');
        doc.text('PhotoStudio', 40, 45);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorAccent);
        doc.text('Package Details', 40, 62);
        doc.setDrawColor(colorBorder);
        doc.setLineWidth(1);
        doc.line(40, 75, pageWidth - 40, 75);

        // MAIN CONTENT BACKGROUND
        const contentTop = 95;
        const contentHeight = pageHeight - 180;
        doc.setFillColor(colorSurface);
        doc.roundedRect(30, contentTop, pageWidth - 60, contentHeight, 16, 16, 'F');

        // BODY
        let y = contentTop + 35;
        const left = 60;
        doc.setFontSize(18);
        doc.setTextColor(colorText);
        doc.setFont('helvetica', 'bold');
        doc.text(pkg.name, left, y);
        y += 28;
        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorAccent);
        doc.text(pkg.packageType, left, y);
        doc.setTextColor(colorText);
        doc.text(`${pkg.investment.toLocaleString()} LKR`, pageWidth - left, y, { align: 'right' });
        y += 18;

        // Services Included
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(colorAccent);
        doc.text('Services Included', left, y);
        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        pkg.servicesIncluded.forEach((service, idx) => {
            doc.text(`• ${service}`, left + 15, y);
            y += 18;
        });
        y += 18;

        // Additional Items
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(colorAccent);
        doc.text('Additional Items', left, y);
        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        if (pkg.additionalItems.editedImages)
            doc.text(`Edited Images: ${pkg.additionalItems.editedImages}`, left + 15, y), y += 18;
        if (pkg.additionalItems.uneditedImages)
            doc.text(`Unedited Images: ${pkg.additionalItems.uneditedImages}`, left + 15, y), y += 18;
        if (pkg.additionalItems.thankYouCards)
            doc.text(`Thank You Cards: ${pkg.additionalItems.thankYouCards}`, left + 15, y), y += 18;
        if (pkg.additionalItems.albums && pkg.additionalItems.albums.length > 0) {
            pkg.additionalItems.albums.forEach((album, idx) => {
                doc.text(`Album: ${album.size}, ${album.type}, ${album.spreadCount} spreads`, left + 15, y);
                y += 18;
            });
        }
        if (pkg.additionalItems.framedPortraits && pkg.additionalItems.framedPortraits.length > 0) {
            pkg.additionalItems.framedPortraits.forEach((portrait, idx) => {
                doc.text(`Framed Portrait: ${portrait.size}, Quantity: ${portrait.quantity}`, left + 15, y);
                y += 18;
            });
        }

        // FOOTER
        doc.setFillColor(colorSurface);
        doc.rect(0, pageHeight - 50, pageWidth, 50, 'F');
        doc.setFontSize(10);
        doc.setTextColor(colorText);
        doc.text('Contact: info@photostudio.com | +94 77 123 4567 | www.photostudio.com', 40, pageHeight - 25);
        doc.setFontSize(9);
        doc.setTextColor(colorAccent);
        doc.text('Capturing Moments, Creating Memories', 40, pageHeight - 10);

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
                                <button
                                    onClick={() => handleDownloadPDF(pkg)}
                                    className={styles.downloadButton}
                                    aria-label="Download PDF"
                                >
                                    <DocumentArrowDownIcon className="w-5 h-5" />
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
