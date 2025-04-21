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
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <CameraIcon className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {package_?.name} - Customize
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                        <p className="text-xl font-medium text-green-600">
                            Base Price: {package_?.investment} LKR
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Base Services */}
                        <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckIcon className="h-6 w-6 text-blue-500" />
                                <h2 className="text-xl font-semibold text-card-foreground">
                                    Base Services Included
                                </h2>
                            </div>
                            <ul className="list-none pl-6 space-y-2 text-muted-foreground">
                                {package_?.servicesIncluded.map((service, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-emerald-500" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Additional Services */}
                        <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <GiftIcon className="h-6 w-6 text-purple-500" />
                                <h2 className="text-xl font-semibold text-card-foreground">
                                    Additional Services
                                </h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {package_?.additionalServices.map((service, index) => {
                                    const Icon = additionalServicesOptions[index].icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-3 p-4 rounded-lg border ${
                                                service.selected 
                                                    ? 'bg-blue-50 border-blue-500' 
                                                    : 'bg-background hover:bg-accent/50'
                                            } transition-colors cursor-pointer`}
                                            onClick={() => handleServiceToggle(index)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={service.selected}
                                                onChange={() => handleServiceToggle(index)}
                                                className="h-4 w-4 rounded border-blue-500 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex-1 flex items-center gap-2">
                                                <Icon className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-foreground">{service.name}</p>
                                                    <p className="text-sm text-blue-600">{service.price} LKR</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Package Items */}
                        <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <BookOpenIcon className="h-6 w-6 text-indigo-500" />
                                <h2 className="text-xl font-semibold text-card-foreground">
                                    Package Items
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <PhotoIcon className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="font-medium text-foreground">Edited Images:</p>
                                        <p className="text-muted-foreground">{package_?.additionalItems.editedImages}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhotoIcon className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="font-medium text-foreground">Unedited Images:</p>
                                        <p className="text-muted-foreground">{package_?.additionalItems.uneditedImages}</p>
                                    </div>
                                </div>
                                {package_?.additionalItems.albums && (
                                    <div className="flex items-start gap-2">
                                        <BookOpenIcon className="h-5 w-5 text-indigo-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Albums:</p>
                                            <ul className="list-none space-y-1 text-muted-foreground">
                                                {package_.additionalItems.albums.map((album, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                                        {album.size} {album.type} ({album.spreadCount} spreads)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {package_?.additionalItems.framedPortraits && (
                                    <div className="flex items-start gap-2">
                                        <PhotoIcon className="h-5 w-5 text-amber-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Framed Portraits:</p>
                                            <ul className="list-none space-y-1 text-muted-foreground">
                                                {package_.additionalItems.framedPortraits.map((portrait, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                                        {portrait.size} (Quantity: {portrait.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <GiftIcon className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <p className="font-medium text-foreground">Thank You Cards:</p>
                                        <p className="text-muted-foreground">{package_?.additionalItems.thankYouCards}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="bg-primary/5 rounded-lg border shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Total Investment
                                    </h2>
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                    {totalPrice} LKR
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4 text-gray-500" />
                                Back
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600"
                            >
                                <ArrowDownOnSquareIcon className="h-4 w-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizePage;