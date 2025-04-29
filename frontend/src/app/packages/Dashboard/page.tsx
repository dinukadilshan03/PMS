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
import WishlistButton from '../../../components/WishlistButton';

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

        // Define colors
        const colors = {
            primary: '#937d5e',      // Your accent color
            secondary: '#b8a088',    // Lighter accent
            text: '#2d2926',         // Dark text
            lightText: '#6B7280',    // Gray text
            highlight: '#e63946',    // Bright accent for important info
            background: '#f7f6f2',   // Light background
            success: '#059669'       // Green for checkmarks
        };

        // Add background
        doc.setFillColor(colors.background);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Header with gradient-like effect
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, pageWidth, 120, 'F');
        doc.setFillColor(colors.secondary);
        doc.rect(0, 120, pageWidth, 10, 'F');

        // Logo/Title Section
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.text('PhotoStudio', 40, 60);
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Package Details', 40, 90);

        // Package Name & Type
        const startY = 180;
        let currentY = startY;

        doc.setTextColor(colors.text);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(pkg.name, 40, currentY);
        currentY += 30;

        doc.setTextColor(colors.primary);
        doc.setFontSize(16);
        doc.text(pkg.packageType, 40, currentY);
        
        // Price in highlighted box
        doc.setFillColor(colors.primary);
        const priceText = `${pkg.investment.toLocaleString()} LKR`;
        const priceWidth = doc.getTextWidth(priceText) + 40;
        doc.roundedRect(pageWidth - priceWidth - 40, currentY - 20, priceWidth, 30, 5, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(priceText, pageWidth - 40, currentY, { align: 'right' });
        currentY += 50;

        // Services Section
        doc.setTextColor(colors.text);
        doc.setFontSize(18);
        doc.text('Services Included', 40, currentY);
        currentY += 20;

        // Add decorative line
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(2);
        doc.line(40, currentY, pageWidth - 40, currentY);
        currentY += 30;

        // Services list with checkmarks
        doc.setTextColor(colors.text);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        pkg.servicesIncluded?.forEach((service) => {
            // Checkmark circle
            doc.setFillColor(colors.success);
            doc.circle(50, currentY - 4, 4, 'F');
            
            // Service text
            doc.text(service, 70, currentY);
            currentY += 25;
        });
        currentY += 20;

        // Additional Items Section
        if (pkg.additionalItems) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('Additional Items', 40, currentY);
            currentY += 20;

            // Add decorative line
            doc.setDrawColor(colors.secondary);
            doc.setLineWidth(2);
            doc.line(40, currentY, pageWidth - 40, currentY);
            currentY += 30;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            // Function to add item with icon indicator
            const addItem = (text: string) => {
                doc.setFillColor(colors.secondary);
                doc.circle(50, currentY - 4, 4, 'F');
                doc.text(text, 70, currentY);
                currentY += 25;
            };

            if (pkg.additionalItems.editedImages) {
                addItem(`Edited Images: ${pkg.additionalItems.editedImages}`);
            }
            if (pkg.additionalItems.uneditedImages) {
                addItem(`Unedited Images: ${pkg.additionalItems.uneditedImages}`);
            }
            if (pkg.additionalItems.thankYouCards) {
                addItem(`Thank You Cards: ${pkg.additionalItems.thankYouCards}`);
            }
            if (pkg.additionalItems.albums) {
                pkg.additionalItems.albums.forEach(album => {
                    addItem(`Album: ${album.size}, ${album.type}, ${album.spreadCount} spreads`);
                });
            }
            if (pkg.additionalItems.framedPortraits) {
                pkg.additionalItems.framedPortraits.forEach(portrait => {
                    addItem(`Framed Portrait: ${portrait.size}, Quantity: ${portrait.quantity}`);
                });
            }
        }

        // Footer
        const footerY = pageHeight - 40;
        doc.setFillColor(colors.primary);
        doc.rect(0, footerY - 20, pageWidth, 60, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Contact: info@photostudio.com | +94 77 123 4567 | www.photostudio.com', 40, footerY + 5);
        
        doc.setFontSize(9);
        doc.setTextColor(colors.background);
        doc.text('Capturing Moments, Creating Memories', 40, footerY + 20);

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
                <h1 className={styles.dashboardTitle}>Photography Packages</h1>
            </div> */}

            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <input
                        type="text"
                        placeholder="Search packages..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MagnifyingGlassIcon className={styles.searchIcon} />
                </div>
                <div className={styles.priceFilter}>
                    <div className={styles.priceInputWrapper}>
                        <input
                            type="number"
                            placeholder="Min price"
                            className={styles.priceInput}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <CurrencyDollarIcon className={styles.priceIcon} />
                    </div>
                    <span className={styles.priceSeparator}>to</span>
                    <div className={styles.priceInputWrapper}>
                        <input
                            type="number"
                            placeholder="Max price"
                            className={styles.priceInput}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <CurrencyDollarIcon className={styles.priceIcon} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading} />
            ) : (
                <div className={styles.packageList}>
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} className={styles.packageCard} style={{ position: 'relative' }}>
                            <div className={styles.packageCardContent}>
                                {/* Wishlist Button in top right */}
                                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                                    <WishlistButton
                                        packageId={pkg.id}
                                        packageType={pkg.packageType}
                                        packageName={pkg.name}
                                        price={pkg.investment}
                                        imageUrl={pkg.image}
                                    />
                                </div>
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
            )}

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
