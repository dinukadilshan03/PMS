"use client";

import { useEffect, useState } from "react";
import { Package } from '@/app/packages/types/Package';
import { getPackages, deletePackage } from '@/app/packages/utils/api';
import Link from 'next/link';
import { jsPDF } from "jspdf";
import { 
    PencilIcon, 
    TrashIcon, 
    ArrowDownTrayIcon,
    PhotoIcon,
    CameraIcon,
    RectangleGroupIcon,
    Square2StackIcon,
    DocumentTextIcon,
    CheckIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    FilmIcon,
    PhotoIcon as PhotoIconSolid,
    GiftIcon,
    BookOpenIcon,
    RectangleStackIcon,
    TagIcon,
    CreditCardIcon,
    CubeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

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
            await deletePackage(id);
            setPackages(packages.filter((pkg) => pkg.id !== id));
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const renderAdditionalItems = (pkg: Package) => {
        return (
            <div className="space-y-4">
                <div className="flex flex-col bg-[#f7f6f2] p-3 rounded-lg border border-[#e5e1da]/50">
                    <span className="font-medium text-[#2d2926] text-sm mb-1">Edited Images:</span>
                    <span className="text-[#2d2926]/80 text-sm">{pkg.additionalItems.editedImages || 'N/A'}</span>
                </div>
                <div className="flex flex-col bg-[#f7f6f2] p-3 rounded-lg border border-[#e5e1da]/50">
                    <span className="font-medium text-[#2d2926] text-sm mb-1">Unedited Images:</span>
                    <span className="text-[#2d2926]/80 text-sm">{pkg.additionalItems.uneditedImages || 'N/A'}</span>
                </div>
                <div className="flex flex-col bg-[#f7f6f2] p-3 rounded-lg border border-[#e5e1da]/50">
                    <span className="font-medium text-[#2d2926] text-sm mb-1">Albums:</span>
                    <ul className="list-disc pl-5 text-[#2d2926]/80 text-sm space-y-1">
                        {pkg.additionalItems.albums?.length ? (
                            pkg.additionalItems.albums.map((album, index) => (
                                <li key={index}>
                                    {album.size} {album.type} (Spread Count: {album.spreadCount})
                                </li>
                            ))
                        ) : (
                            <li>N/A</li>
                        )}
                    </ul>
                </div>
                <div className="flex flex-col bg-[#f7f6f2] p-3 rounded-lg border border-[#e5e1da]/50">
                    <span className="font-medium text-[#2d2926] text-sm mb-1">Framed Portraits:</span>
                    <ul className="list-disc pl-5 text-[#2d2926]/80 text-sm space-y-1">
                        {pkg.additionalItems.framedPortraits?.length ? (
                            pkg.additionalItems.framedPortraits.map((portrait, index) => (
                                <li key={index}>
                                    {portrait.size} (Quantity: {portrait.quantity})
                                </li>
                            ))
                        ) : (
                            <li>N/A</li>
                        )}
                    </ul>
                </div>
                <div className="flex flex-col bg-[#f7f6f2] p-3 rounded-lg border border-[#e5e1da]/50">
                    <span className="font-medium text-[#2d2926] text-sm mb-1">Thank You Cards:</span>
                    <span className="text-[#2d2926]/80 text-sm">{pkg.additionalItems.thankYouCards || 'N/A'}</span>
                </div>
            </div>
        );
    };

    const handleDownloadPDF = (pkg: Package) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const colorHeader = '#b6a489';
        const colorMain = '#f7f6f2';
        const colorFooter = '#f7f6f2';
        const colorText = '#2d2926';
        const colorAccent = '#b6a489';
        const colorBorder = '#e5e1da';

        doc.setFillColor(colorHeader);
        doc.rect(0, 0, pageWidth, 90, 'F');
        doc.setFontSize(26);
        doc.setTextColor('#fff');
        doc.setFont('helvetica', 'bold');
        doc.text('PhotoStudio', 48, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#ede7df');
        doc.text('Package Details', 48, 78);
        doc.setDrawColor(colorBorder);
        doc.setLineWidth(1.2);
        doc.line(48, 92, pageWidth - 48, 92);

        const contentTop = 110;
        const contentHeight = pageHeight - 210;
        doc.setFillColor(colorMain);
        doc.roundedRect(38, contentTop, pageWidth - 76, contentHeight, 18, 18, 'F');

        let y = contentTop + 38;
        const left = 70;
        doc.setFontSize(20);
        doc.setTextColor(colorText);
        doc.setFont('helvetica', 'bold');
        doc.text(pkg.name, left, y);
        y += 32;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorAccent);
        doc.text(`Package Type: ${pkg.packageType}`, left, y);
        doc.setTextColor(colorText);
        doc.text(`${pkg.investment} LKR`, pageWidth - left, y, { align: 'right' });
        y += 22;
        doc.setDrawColor(colorBorder);
        doc.setLineWidth(0.7);
        doc.line(left, y, pageWidth - left, y);
        y += 28;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colorAccent);
        doc.text('Services Included', left, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        pkg.servicesIncluded.forEach((service, idx) => {
            doc.text(`• ${service}`, left + 18, y);
            y += 18;
        });
        y += 22;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colorAccent);
        doc.text('Additional Items', left, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        doc.text(`Edited Images: ${pkg.additionalItems.editedImages || 'N/A'}`, left + 18, y);
        y += 18;
        doc.text(`Unedited Images: ${pkg.additionalItems.uneditedImages || 'N/A'}`, left + 18, y);
        y += 18;
        if (pkg.additionalItems.albums?.length) {
            doc.text('Albums:', left + 18, y);
            y += 18;
            pkg.additionalItems.albums.forEach((album) => {
                doc.text(`- ${album.size} ${album.type} (Spread Count: ${album.spreadCount})`, left + 36, y);
                y += 16;
            });
        }
        if (pkg.additionalItems.framedPortraits?.length) {
            doc.text('Framed Portraits:', left + 18, y);
            y += 18;
            pkg.additionalItems.framedPortraits.forEach((portrait) => {
                doc.text(`- ${portrait.size} (Quantity: ${portrait.quantity})`, left + 36, y);
                y += 16;
            });
        }
        doc.text(`Thank You Cards: ${pkg.additionalItems.thankYouCards || 'N/A'}`, left + 18, y);
        y += 28;

        doc.setFillColor(colorFooter);
        doc.rect(0, pageHeight - 60, pageWidth, 60, 'F');
        doc.setFontSize(11);
        doc.setTextColor(colorText);
        doc.text('Contact: info@photostudio.com | +94 77 123 4567 | www.photostudio.com', 48, pageHeight - 30);
        doc.setFontSize(10);
        doc.setTextColor(colorAccent);
        doc.text('Capturing Moments, Creating Memories', 48, pageHeight - 12);

        doc.save(`${pkg.name || 'custom-package'}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#e9e5dc] py-16 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-light text-[#2d2926] mb-2 tracking-wide">Packages</h1>
                        <div className="w-16 h-1 bg-[#937d5e] mx-auto mb-6" />
                        {/* <p className="text-center text-base text-[#2d2926]/80 mb-8 font-light">Manage and view all photography packages</p> */}
                    </div>
                    <Link
                        href="/packages/create"
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-[#2d2926] bg-[#f7f6f2] rounded-full border-2 border-[#e5e1da] hover:bg-[#ede7df] hover:border-[#937d5e] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <span className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#937d5e] text-white group-hover:bg-[#7a674d] transition-colors duration-300">
                            <PlusIcon className="w-5 h-5" />
                        </span>
                        <span className="ml-4">Create Package</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-16 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#937d5e] border-t-transparent" />
                    </div>
                ) : error ? (
                    <div className="mt-16 rounded-lg border-2 border-[#937d5e]/40 bg-[#f7f6f2] p-8 text-center shadow-lg">
                        <p className="text-[#2d2926] font-medium text-lg">{error}</p>
                        <p className="mt-3 text-sm text-[#2d2926]/70">
                            Please ensure that:<br />1. The backend server is running on port 8080<br />2. The API endpoint is accessible<br />3. Your network connection is stable
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {packages.length === 0 ? (
                            <div className="col-span-full rounded-lg border-2 border-[#937d5e]/40 bg-[#f7f6f2] p-12 text-center shadow-lg">
                                <p className="text-xl text-[#937d5e] font-medium">No packages available.</p>
                            </div>
                        ) : (
                            packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="group relative overflow-hidden rounded-[2rem] bg-[#f7f6f2] shadow-xl border-2 border-[#e5e1da] flex flex-col min-h-[400px] px-0 pt-8 pb-6 items-center hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                                    style={{ boxShadow: '0 8px 32px rgba(45,41,38,0.15)' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#937d5e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="w-40 h-40 bg-[#d6cebf] rounded-full flex flex-col items-center justify-center mb-8 border-2 border-[#e5e1da] shadow-md group-hover:shadow-lg transition-all duration-300">
                                        <h2 className="text-2xl font-serif font-light text-[#2d2926] text-center leading-tight mb-2 group-hover:text-[#937d5e] transition-colors duration-300">{pkg.name}</h2>
                                        <span className="text-xl font-medium text-[#937d5e] group-hover:text-[#7a674d] transition-colors duration-300">{pkg.investment} LKR</span>
                                        <span className="text-sm uppercase tracking-wider bg-[#f7f6f2] text-[#937d5e] px-4 py-1.5 rounded-full mt-3 border border-[#e5e1da] group-hover:bg-[#ede7df] transition-all duration-300">{pkg.packageType}</span>
                                    </div>

                                    <div className="flex-1 w-full px-8 flex flex-col gap-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 rounded-lg bg-[#ede7df] group-hover:bg-[#d6c7b0] transition-colors duration-300">
                                                    <SparklesIcon className="h-6 w-6 text-[#937d5e]" />
                                                </div>
                                                <h3 className="font-medium text-[#2d2926] text-lg group-hover:text-[#937d5e] transition-colors duration-300">Services Included:</h3>
                                            </div>
                                            <hr className="border-[#e5e1da] mb-4 group-hover:border-[#d6c7b0] transition-colors duration-300" />
                                            <ul className="list-disc pl-6 text-[#2d2926]/80 text-base space-y-3">
                                                {pkg.servicesIncluded?.map((service, index) => (
                                                    <li key={index} className="hover:text-[#937d5e] transition-colors duration-200 flex items-center gap-3 group">
                                                        <div className="p-1.5 rounded-full bg-[#ede7df] group-hover:bg-[#d6c7b0] transition-colors duration-300">
                                                            <CheckIcon className="h-5 w-5 text-[#937d5e]" />
                                                        </div>
                                                        {service}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 rounded-lg bg-[#ede7df] group-hover:bg-[#d6c7b0] transition-colors duration-300">
                                                    <GiftIcon className="h-6 w-6 text-[#937d5e]" />
                                                </div>
                                                <h3 className="font-medium text-[#2d2926] text-lg group-hover:text-[#937d5e] transition-colors duration-300">Additional Items:</h3>
                                            </div>
                                            <hr className="border-[#e5e1da] mb-4 group-hover:border-[#d6c7b0] transition-colors duration-300" />
                                            {renderAdditionalItems(pkg)}
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-4 w-full mt-8 px-8">
                                        <Link
                                            href={`/packages/edit/${pkg.id}`}
                                            className="group flex items-center justify-center flex-1 py-3 rounded-lg bg-[#ede7df] text-[#937d5e] border-2 border-[#d6c7b0] transition-all duration-200 hover:bg-[#d6c7b0] hover:text-[#2d2926] hover:border-[#937d5e] shadow-md hover:shadow-lg"
                                            aria-label="Edit"
                                        >
                                            <PencilIcon className="w-6 h-6" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-[#2d2926] text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">Edit</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="group flex items-center justify-center flex-1 py-3 rounded-lg bg-red-50 text-red-600 border-2 border-red-200 transition-all duration-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300 shadow-md hover:shadow-lg"
                                            aria-label="Delete"
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-[#2d2926] text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">Delete</span>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPDF(pkg)}
                                            className="group flex items-center justify-center flex-1 py-3 rounded-lg bg-[#ede7df] text-[#937d5e] border-2 border-[#d6c7b0] transition-all duration-200 hover:bg-[#d6c7b0] hover:text-[#2d2926] hover:border-[#937d5e] shadow-md hover:shadow-lg"
                                            aria-label="Download PDF"
                                        >
                                            <ArrowDownTrayIcon className="w-6 h-6" />
                                            <span className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-[#2d2926] text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">Download</span>
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