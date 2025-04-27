"use client";

import { useEffect, useState } from "react";
import { Package } from "@/app/packages/types/Package";
import { useParams, useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import {
    CameraIcon,
    VideoCameraIcon,
    ClockIcon,
    UserPlusIcon,
    PhotoIcon,
    GlobeAltIcon,
    CheckIcon,
    ArrowLeftIcon,
    ArrowDownOnSquareIcon,
    CurrencyDollarIcon,
    GiftIcon,
    BookOpenIcon
} from "@heroicons/react/20/solid";

interface CustomizedPackage extends Package {
    additionalServices: {
        name: string;
        selected: boolean;
        price: number;
    }[];
}

const CustomizePage = () => {
    const params = useParams();
    const router = useRouter();
    const [package_, setPackage] = useState<CustomizedPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const additionalServicesOptions = [
        { name: "Drone Photography", price: 15000, icon: CameraIcon },
        { name: "Same Day Edit", price: 25000, icon: VideoCameraIcon },
        { name: "Extended Hours (per hour)", price: 10000, icon: ClockIcon },
        { name: "Additional Photographer", price: 20000, icon: UserPlusIcon },
        { name: "Photo Booth", price: 15000, icon: PhotoIcon },
        { name: "Live Streaming", price: 30000, icon: GlobeAltIcon },
    ];

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/packages/${params.id}`);
                if (!response.ok) throw new Error('Package not found');
                const data = await response.json();
                
                // Add additional services to the package
                const enhancedPackage: CustomizedPackage = {
                    ...data,
                    additionalServices: additionalServicesOptions.map(service => ({
                        ...service,
                        selected: false
                    }))
                };
                
                setPackage(enhancedPackage);
                setTotalPrice(enhancedPackage.investment);
            } catch (error) {
                setError('Failed to load package details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPackage();
        }
    }, [params.id]);

    const handleServiceToggle = (index: number) => {
        if (!package_) return;

        const updatedPackage = {
            ...package_,
            additionalServices: package_.additionalServices.map((service, i) => {
                if (i === index) {
                    return { ...service, selected: !service.selected };
                }
                return service;
            })
        };

        setPackage(updatedPackage);

        // Recalculate total price
        const additionalCost = updatedPackage.additionalServices.reduce((sum, service) => {
            return sum + (service.selected ? service.price : 0);
        }, 0);
        setTotalPrice(updatedPackage.investment + additionalCost);
    };

    const handleDownloadPDF = () => {
        if (!package_) return;

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Colors
        const colorHeader = '#b6a489'; // darker taupe/greige for header
        const colorMain = '#f7f6f2';   // very light for content
        const colorFooter = '#f7f6f2';
        const colorText = '#2d2926';
        const colorAccent = '#b6a489';
        const colorBorder = '#e5e1da';

        // HEADER (darker)
        doc.setFillColor(colorHeader);
        doc.rect(0, 0, pageWidth, 90, 'F');
        doc.setFontSize(26);
        doc.setTextColor('#fff');
        doc.setFont('helvetica', 'bold');
        doc.text('PhotoStudio', 48, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#ede7df');
        doc.text('Customized Package Details', 48, 78);
        doc.setDrawColor(colorBorder);
        doc.setLineWidth(1.2);
        doc.line(48, 92, pageWidth - 48, 92);

        // MAIN CONTENT BACKGROUND (light)
        const contentTop = 110;
        const contentHeight = pageHeight - 210;
        doc.setFillColor(colorMain);
        doc.roundedRect(38, contentTop, pageWidth - 76, contentHeight, 18, 18, 'F');

        // BODY
        let y = contentTop + 38;
        const left = 70;
        doc.setFontSize(20);
        doc.setTextColor(colorText);
        doc.setFont('helvetica', 'bold');
        doc.text(`${package_.name} - Customized`, left, y);
        y += 32;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorAccent);
        doc.text(`Base Price: ${package_.investment} LKR`, left, y);
        doc.setTextColor(colorText);
        y += 22;
        doc.setDrawColor(colorBorder);
        doc.setLineWidth(0.7);
        doc.line(left, y, pageWidth - left, y);
        y += 28;

        // Services Included
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colorAccent);
        doc.text('Base Services Included', left, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
        doc.setTextColor(colorText);
        package_.servicesIncluded.forEach((service, idx) => {
            doc.text(`• ${service}`, left + 18, y);
            y += 18;
        });
        y += 22;

        // Additional Services
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colorAccent);
        doc.text('Additional Services Selected', left, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        const selectedServices = package_.additionalServices.filter(service => service.selected);
        if (selectedServices.length === 0) {
            doc.text('None', left + 18, y);
            y += 18;
        } else {
            selectedServices.forEach((service, idx) => {
                doc.text(`• ${service.name} - ${service.price} LKR`, left + 18, y);
                y += 18;
        });
        }
        y += 22;

        // Additional Items
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colorAccent);
        doc.text('Package Items', left, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(colorText);
        doc.text(`Edited Images: ${package_.additionalItems.editedImages}`, left + 18, y);
        y += 18;
        doc.text(`Unedited Images: ${package_.additionalItems.uneditedImages}`, left + 18, y);
        y += 18;
        if (package_.additionalItems.albums?.length) {
            doc.text('Albums:', left + 18, y);
            y += 18;
            package_.additionalItems.albums.forEach((album) => {
                doc.text(`- ${album.size} ${album.type} (${album.spreadCount} spreads)`, left + 36, y);
                y += 16;
            });
        }
        if (package_.additionalItems.framedPortraits?.length) {
            doc.text('Framed Portraits:', left + 18, y);
            y += 18;
            package_.additionalItems.framedPortraits.forEach((portrait) => {
                doc.text(`- ${portrait.size} (Quantity: ${portrait.quantity})`, left + 36, y);
                y += 16;
            });
        }
        doc.text(`Thank You Cards: ${package_.additionalItems.thankYouCards}`, left + 18, y);
        y += 28;

        // Total Price
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(colorAccent);
        doc.text(`Total Investment: ${totalPrice} LKR`, left, y);

        // FOOTER
        doc.setFillColor(colorFooter);
        doc.rect(0, pageHeight - 60, pageWidth, 60, 'F');
        doc.setFontSize(11);
        doc.setTextColor(colorText);
        doc.text('Contact: info@photostudio.com | +94 77 123 4567 | www.photostudio.com', 48, pageHeight - 30);
        doc.setFontSize(10);
        doc.setTextColor(colorAccent);
        doc.text('Capturing Moments, Creating Memories', 48, pageHeight - 12);

        doc.save(`${package_.name}-customized.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error || !package_) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                        <p className="text-destructive">{error || 'Package not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#b09f88] flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-[3rem_1rem_3rem_1rem] shadow-2xl p-10 flex flex-col gap-10">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 mb-2">
                    <CameraIcon className="h-10 w-10 text-[#b6a489] mb-2" />
                    <h1 className="text-3xl font-serif font-bold text-[#2d2926] tracking-wide">{package_?.name} - Customize</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-[#b6a489]" />
                        <span className="text-lg font-medium text-[#2d2926]">Base Price: {package_?.investment} LKR</span>
                    </div>
                    </div>
                <hr className="my-2 border-[#ede7df]" />
                        {/* Base Services */}
                <section>
                    <h3 className="text-lg font-serif font-medium text-[#2d2926] mb-3">Base Services Included</h3>
                    <ul className="list-none pl-0 space-y-2 text-[#4b4b4b]">
                                {package_?.servicesIncluded.map((service, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-emerald-500" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                </section>
                <hr className="my-2 border-[#ede7df]" />
                        {/* Additional Services */}
                <section>
                    <h3 className="text-lg font-serif font-medium text-[#2d2926] mb-3">Additional Services</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                                {package_?.additionalServices.map((service, index) => {
                                    const Icon = additionalServicesOptions[index].icon;
                                    return (
                                <label
                                            key={index}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${service.selected ? 'bg-[#e0ecec] border-[#b6a489]' : 'bg-white border-[#e5e1da] hover:bg-[#f7f6f2]'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={service.selected}
                                                onChange={() => handleServiceToggle(index)}
                                        className="accent-[#b6a489] w-4 h-4 rounded-full border border-[#b6a489]"
                                            />
                                    <Icon className="h-5 w-5 text-[#b6a489]" />
                                    <span className="flex-1 text-sm text-[#2d2926]">{service.name}</span>
                                    <span className="text-xs text-[#6b6b6b]">{service.price} LKR</span>
                                </label>
                                    );
                                })}
                            </div>
                </section>
                <hr className="my-2 border-[#ede7df]" />
                        {/* Package Items */}
                <section>
                    <h3 className="text-lg font-serif font-medium text-[#2d2926] mb-3">Package Items</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-semibold text-[#b6a489] uppercase tracking-wider pb-2">Item</th>
                                    <th className="text-left text-xs font-semibold text-[#b6a489] uppercase tracking-wider pb-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-[#f7f6f2]">
                                    <td className="py-2 pr-4 font-medium text-[#2d2926]">Edited Images</td>
                                    <td className="py-2 text-[#6b6b6b]">{package_?.additionalItems.editedImages}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-medium text-[#2d2926]">Unedited Images</td>
                                    <td className="py-2 text-[#6b6b6b]">{package_?.additionalItems.uneditedImages}</td>
                                </tr>
                                {package_?.additionalItems.albums && package_.additionalItems.albums.length > 0 && (
                                    <tr className="bg-[#f7f6f2]">
                                        <td className="py-2 pr-4 font-medium text-[#2d2926] align-top">Albums</td>
                                        <td className="py-2 text-[#6b6b6b]">
                                            <ul className="list-disc pl-4">
                                                {package_.additionalItems.albums.map((album, index) => (
                                                    <li key={index}>{album.size} {album.type} ({album.spreadCount} spreads)</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                                {package_?.additionalItems.framedPortraits && package_.additionalItems.framedPortraits.length > 0 && (
                                    <tr>
                                        <td className="py-2 pr-4 font-medium text-[#2d2926] align-top">Framed Portraits</td>
                                        <td className="py-2 text-[#6b6b6b]">
                                            <ul className="list-disc pl-4">
                                                {package_.additionalItems.framedPortraits.map((portrait, index) => (
                                                    <li key={index}>{portrait.size} (Quantity: {portrait.quantity})</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                                <tr className="bg-[#f7f6f2]">
                                    <td className="py-2 pr-4 font-medium text-[#2d2926]">Thank You Cards</td>
                                    <td className="py-2 text-[#6b6b6b]">{package_?.additionalItems.thankYouCards}</td>
                                </tr>
                            </tbody>
                        </table>
                                    </div>
                </section>
                <hr className="my-2 border-[#ede7df]" />
                        {/* Total Price */}
                <section className="flex items-center justify-between mt-2">
                    <span className="text-base font-serif font-medium text-[#2d2926]">Total Investment</span>
                    <span className="text-xl font-bold text-[#b6a489]">{totalPrice} LKR</span>
                </section>
                        {/* Actions */}
                <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => router.back()}
                        className="py-3 px-8 rounded-full bg-[#ede7df] text-[#2d2926] font-medium text-sm shadow hover:bg-[#e9e5dc] transition"
                        type="button"
                            >
                                Back
                            </button>
                    <button
                        onClick={() => router.push(`/bookings/create?packageName=${encodeURIComponent(package_.name)}`)}
                        className="py-3 px-8 rounded-full bg-[#b6a489] text-white font-medium text-sm shadow hover:bg-[#937d5e] transition"
                        type="button"
                    >
                        Book Now
                    </button>
                            <button
                                onClick={handleDownloadPDF}
                        className="py-3 px-8 rounded-full bg-[#a08c6b] text-white font-medium text-sm shadow hover:bg-[#7c6a53] transition"
                        type="button"
                        aria-label="Download PDF"
                            >
                        <ArrowDownOnSquareIcon className="w-5 h-5" />
                            </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizePage;