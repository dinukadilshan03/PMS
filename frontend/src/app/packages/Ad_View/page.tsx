"use client";

import { useEffect, useState } from "react";
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

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
        <div className="min-h-screen bg-[#ede7df] font-sans">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row mb-10">
                    <h1 className="text-4xl font-light tracking-tight text-[#2d2926] font-serif">Photography Packages</h1>
                    <Link
                        href="/packages/create"
                        className="inline-flex items-center justify-center rounded bg-[#d6c7b0] px-6 py-2 text-base font-medium text-[#2d2926] shadow-sm hover:bg-[#cbb89e] transition"
                    >
                        Create Package
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-16 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d6c7b0] border-t-transparent" />
                    </div>
                ) : error ? (
                    <div className="mt-16 rounded-lg border border-[#d6c7b0]/40 bg-[#f7f6f2] p-6 text-center">
                        <p className="text-[#2d2926] font-medium">{error}</p>
                        <p className="mt-2 text-sm text-[#2d2926]/70">
                            Please ensure that:<br />1. The backend server is running on port 8080<br />2. The API endpoint is accessible<br />3. Your network connection is stable
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                        {packages.length === 0 ? (
                            <div className="col-span-full rounded-lg border bg-[#f7f6f2] p-12 text-center text-[#2d2926] shadow-sm">
                                <p className="text-lg text-[#b6a489]">No packages available.</p>
                            </div>
                        ) : (
                            packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="relative overflow-hidden rounded-[2.5rem] bg-[#f7f6f2] shadow border border-[#e5e1da] flex flex-col min-h-[340px] px-0 pt-8 pb-6 items-center"
                                    style={{ boxShadow: '0 8px 32px rgba(45,41,38,0.07)' }}
                                >
                                    {/* Decorative arch/oval shape for package name and price */}
                                    <div className="w-32 h-32 bg-[#ede7df] rounded-full flex flex-col items-center justify-center mb-4 border border-[#e5e1da] shadow-sm">
                                        <h2 className="text-lg font-serif font-light text-[#2d2926] text-center leading-tight mb-1">{pkg.name}</h2>
                                        <span className="text-base font-medium text-[#b6a489]">{pkg.investment} LKR</span>
                                        <span className="text-xs uppercase tracking-wider bg-[#e5e1da] text-[#b6a489] px-3 py-1 rounded mt-2">{pkg.packageType}</span>
                                    </div>
                                    <div className="flex-1 w-full px-6 flex flex-col gap-3">
                                        <h3 className="font-medium text-[#2d2926] mb-1 text-sm">Services Included:</h3>
                                        <ul className="list-disc pl-6 text-[#2d2926]/80 text-xs space-y-1">
                                            {pkg.servicesIncluded?.map((service, index) => (
                                                <li key={index}>{service}</li>
                                            ))}
                                        </ul>
                                        <div className="mt-2">
                                            {renderAdditionalItems(pkg)}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3 w-full mt-6 px-6">
                                        <Link
                                            href={`/packages/edit/${pkg.id}`}
                                            className="group flex items-center justify-center flex-1 py-2 rounded-lg bg-[#ede8df] text-[#b6a489] transition hover:bg-[#d6c7b0] hover:text-[#2d2926]"
                                            aria-label="Edit"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#2d2926] text-xs text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">Edit</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="group flex items-center justify-center flex-1 py-2 rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                                            aria-label="Delete"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#2d2926] text-xs text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">Delete</span>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(pkg)}
                                            className="group flex items-center justify-center flex-1 py-2 rounded-lg bg-[#f7f6f2] text-[#2d2926] transition hover:bg-[#ede8df] hover:text-[#b6a489]"
                                            aria-label="Download PDF"
                                        >
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#2d2926] text-xs text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">Download</span>
                                        </button>
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
