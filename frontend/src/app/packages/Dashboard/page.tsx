'use client'; // Important to mark this as a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
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
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <CameraIcon className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">
                        Photography Packages
                    </h1>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-32 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-32 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.length === 0 ? (
                            <div className="col-span-full text-center text-muted-foreground">
                                No packages found
                            </div>
                        ) : (
                            filteredPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-input overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                                                {pkg.name}
                                            </h2>
                                            <p className="text-xl font-medium text-blue-600 mb-1">
                                                {pkg.investment} LKR
                                            </p>
                                            <p className="text-sm text-muted-foreground">{pkg.packageType}</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
                                                    <CheckIcon className="h-5 w-5 text-green-500" />
                                                    Services Included:
                                                </h3>
                                                <ul className="list-none space-y-1 pl-7">
                                                    {pkg.servicesIncluded?.map((service, index) => (
                                                        <li key={index} className="text-muted-foreground flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                            {service}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <PhotoIcon className="h-5 w-5 text-amber-500" />
                                                    <div>
                                                        <span className="font-medium text-card-foreground">
                                                            Edited Images:
                                                        </span>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {pkg.additionalItems?.editedImages || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <PhotoIcon className="h-5 w-5 text-amber-500" />
                                                    <div>
                                                        <span className="font-medium text-card-foreground">
                                                            Unedited Images:
                                                        </span>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {pkg.additionalItems?.uneditedImages || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-input">
                                            <button
                                                onClick={() => handleBooking(pkg)}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                            >
                                                <CalendarDaysIcon className="h-4 w-4" />
                                                Book Now
                                            </button>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleCustomizePackage(pkg)}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <WrenchScrewdriverIcon className="h-4 w-4" />
                                                    Customize
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(pkg)}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <DocumentArrowDownIcon className="h-4 w-4" />
                                                    PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
