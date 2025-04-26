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

        const doc = new jsPDF();
        let yOffset = 10;

        // Title
        doc.setFontSize(22);
        doc.text(`${package_.name} - Customized`, 10, yOffset);
        yOffset += 15;

        // Base Package Details
        doc.setFontSize(16);
        doc.text(`Base Package Price: ${package_.investment} LKR`, 10, yOffset);
        yOffset += 10;

        // Services Included
        doc.text('Base Services Included:', 10, yOffset);
        yOffset += 10;
        package_.servicesIncluded.forEach((service, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${service}`, 15, yOffset);
            yOffset += 7;
        });

        // Additional Services
        doc.setFontSize(16);
        yOffset += 5;
        doc.text('Additional Services Selected:', 10, yOffset);
        yOffset += 10;
        
        const selectedServices = package_.additionalServices.filter(service => service.selected);
        selectedServices.forEach((service, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${service.name} - ${service.price} LKR`, 15, yOffset);
            yOffset += 7;
        });

        // Additional Items
        yOffset += 5;
        doc.setFontSize(16);
        doc.text('Package Items:', 10, yOffset);
        yOffset += 10;

        doc.setFontSize(12);
        doc.text(`Edited Images: ${package_.additionalItems.editedImages}`, 15, yOffset);
        yOffset += 7;
        doc.text(`Unedited Images: ${package_.additionalItems.uneditedImages}`, 15, yOffset);
        yOffset += 7;

        // Albums
        if (package_.additionalItems.albums?.length) {
            doc.text('Albums:', 15, yOffset);
            yOffset += 7;
            package_.additionalItems.albums.forEach((album) => {
                doc.text(`- ${album.size} ${album.type} (${album.spreadCount} spreads)`, 20, yOffset);
                yOffset += 7;
            });
        }

        // Framed Portraits
        if (package_.additionalItems.framedPortraits?.length) {
            doc.text('Framed Portraits:', 15, yOffset);
            yOffset += 7;
            package_.additionalItems.framedPortraits.forEach((portrait) => {
                doc.text(`- ${portrait.size} (Quantity: ${portrait.quantity})`, 20, yOffset);
                yOffset += 7;
            });
        }

        // Thank You Cards
        doc.text(`Thank You Cards: ${package_.additionalItems.thankYouCards}`, 15, yOffset);
        yOffset += 15;

        // Total Price
        doc.setFontSize(16);
        doc.setFont("helvetica", 'bold');
        doc.text(`Total Investment: ${totalPrice} LKR`, 10, yOffset);

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
        <div className="min-h-screen bg-gradient-to-br from-[#e9e5dc] via-[#e0ecec] to-[#cfd8dc] flex items-center justify-center p-4">
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
                        onClick={handleDownloadPDF}
                        className="py-3 px-8 rounded-full bg-[#a08c6b] text-white font-medium text-sm shadow hover:bg-[#7c6a53] transition"
                        type="button"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizePage;