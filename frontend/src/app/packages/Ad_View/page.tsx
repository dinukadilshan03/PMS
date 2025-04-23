"use client";

import { useEffect, useState } from "react";
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

const HomePage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackages();
                setPackages(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Unable to load packages. Please make sure the backend server is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deletePackage(id); // Deleting the package
            setPackages(packages.filter((pkg) => pkg.id !== id)); // Remove from the state
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const renderAdditionalItems = (pkg: Package) => {
        return (
            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Edited Images:</span>
                    <span className="text-gray-600">{pkg.additionalItems.editedImages}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Unedited Images:</span>
                    <span className="text-gray-600">{pkg.additionalItems.uneditedImages}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Albums:</span>
                    <ul className="list-disc pl-6 text-gray-600">
                        {pkg.additionalItems.albums?.map((album, index) => (
                            <li key={index}>
                                {album.size} {album.type} (Spread Count: {album.spreadCount})
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Framed Portraits:</span>
                    <ul className="list-disc pl-6 text-gray-600">
                        {pkg.additionalItems.framedPortraits?.map((portrait, index) => (
                            <li key={index}>
                                {portrait.size} (Quantity: {portrait.quantity})
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Thank You Cards:</span>
                    <span className="text-gray-600">{pkg.additionalItems.thankYouCards}</span>
                </div>
            </div>
        );
    };

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

        // Additional items
        let yOffset = 50 + (pkg.servicesIncluded.length || 0) * 10;
        doc.text('Additional Items:', 10, yOffset);
        yOffset += 10;

        doc.text(`Edited Images: ${pkg.additionalItems.editedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Unedited Images: ${pkg.additionalItems.uneditedImages || 'N/A'}`, 10, yOffset);
        yOffset += 10;

        // Albums
        if (pkg.additionalItems.albums) {
            doc.text('Albums:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.albums.forEach((album, index) => {
                doc.text(`${index + 1}. Size: ${album.size}, Type: ${album.type}, Spread Count: ${album.spreadCount}`, 10, yOffset);
                yOffset += 10;
            });
        }

        // Framed Portraits
        if (pkg.additionalItems.framedPortraits) {
            doc.text('Framed Portraits:', 10, yOffset);
            yOffset += 10;
            pkg.additionalItems.framedPortraits.forEach((portrait, index) => {
                doc.text(`${index + 1}. Size: ${portrait.size}, Quantity: ${portrait.quantity}`, 10, yOffset);
                yOffset += 10;
            });
        }

        doc.text(`Thank You Cards: ${pkg.additionalItems.thankYouCards || 'N/A'}`, 10, yOffset);
        doc.save(`${pkg.name || 'custom-package'}.pdf`);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Photography Packages
                    </h1>
                    <Link
                        href="/packages/create"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Create Package
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-8 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <div className="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                        <p className="text-destructive">{error}</p>
                        <p className="mt-2 text-sm text-destructive/80">
                            Please ensure that:
                            <br />1. The backend server is running on port 8080
                            <br />2. The API endpoint is accessible
                            <br />3. Your network connection is stable
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {packages.length === 0 ? (
                            <div className="col-span-full rounded-lg border bg-card p-8 text-center text-card-foreground">
                                <p className="text-muted-foreground">No packages available.</p>
                            </div>
                        ) : (
                            packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-semibold text-card-foreground">
                                                {pkg.name}
                                            </h2>
                                            <p className="mt-1 text-lg font-medium text-primary">
                                                {pkg.investment} LKR
                                            </p>
                                            <p className="text-sm text-muted-foreground">{pkg.packageType}</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="font-medium text-card-foreground">
                                                    Services Included:
                                                </h3>
                                                <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                                                    {pkg.servicesIncluded?.map((service, index) => (
                                                        <li key={index}>{service}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {renderAdditionalItems(pkg)}
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                                            <Link
                                                href={`/packages/edit/${pkg.id}`}
                                                className="text-sm font-medium text-primary hover:text-primary/90"
                                            >
                                                Edit
                                            </Link>
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/packages/customize/${pkg.id}`}
                                                    className="text-sm font-medium text-primary hover:text-primary/90"
                                                >
                                                    Customize
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="text-sm font-medium text-destructive hover:text-destructive/90"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(pkg)}
                                                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                                >
                                                    Download PDF
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

export default HomePage;
