"use client"; // Important to mark this as a client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CameraIcon,
    PlusIcon,
    XMarkIcon,
    PhotoIcon,
    BookOpenIcon,
    GiftIcon,
    CheckIcon,
    ArrowLeftIcon,
    PencilSquareIcon
} from "@heroicons/react/20/solid";

interface Album {
    size: string;
    type: string;
    spreadCount: string;
}

interface FramedPortrait {
    size: string;
    quantity: string;
}

// Use React.use() to handle the Promise
const EditPackage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [name, setName] = useState("");
    const [investment, setInvestment] = useState("");
    const [packageType, setPackageType] = useState("");
    const [servicesIncluded, setServicesIncluded] = useState<string[]>([]);
    const [editedImages, setEditedImages] = useState("");
    const [uneditedImages, setUneditedImages] = useState("");
    const [albums, setAlbums] = useState<Album[]>([{ size: "", type: "", spreadCount: "" }]);
    const [framedPortraits, setFramedPortraits] = useState<FramedPortrait[]>([{ size: "", quantity: "" }]);
    const [thankYouCards, setThankYouCards] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch the package details when the component loads
    const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

    useEffect(() => {
        // Unwrap the params Promise
        const getParams = async () => {
            const resolvedParams = await params;
            setUnwrappedParams(resolvedParams);
        };

        getParams();
    }, [params]);

    // Fetch package details once params are unwrapped
    useEffect(() => {
        if (unwrappedParams) {
            const fetchPackage = async () => {
                try {
                    const res = await fetch(`http://localhost:8080/api/packages/${unwrappedParams.id}`);
                    const data = await res.json();
                    if (data) {
                        setName(data.name);
                        setInvestment(data.investment.toString());
                        setPackageType(data.packageType);
                        setServicesIncluded(data.servicesIncluded);
                        setEditedImages(data.additionalItems.editedImages);
                        setUneditedImages(data.additionalItems.uneditedImages);
                        setAlbums(data.additionalItems.albums);
                        setFramedPortraits(data.additionalItems.framedPortraits);
                        setThankYouCards(data.additionalItems.thankYouCards.toString());
                    }
                } catch (error) {
                    console.error("Error fetching package:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPackage();
        }
    }, [unwrappedParams]);

    // Form validation logic
    const validateForm = () => {
        if (!name.trim()) {
            alert("Package name is required.");
            return false;
        }
        if (!investment || isNaN(Number(investment)) || Number(investment) <= 0) {
            alert("Investment must be a valid positive number.");
            return false;
        }
        if (!packageType.trim()) {
            alert("Package type is required.");
            return false;
        }
        if (servicesIncluded.length === 0 || servicesIncluded.some(service => !service.trim())) {
            alert("At least one service is required.");
            return false;
        }
        if (!editedImages.trim()) {
            alert("Edited images field is required.");
            return false;
        }
        if (!uneditedImages.trim()) {
            alert("Unedited images field is required.");
            return false;
        }
        if (albums.some(album => !album.size.trim() || !album.type.trim() || isNaN(Number(album.spreadCount)) || Number(album.spreadCount) < 0)) {
            alert("Each album must have a valid size, type, and spread count (non-negative).");
            return false;
        }
        if (framedPortraits.some(portrait => !portrait.size.trim() || isNaN(Number(portrait.quantity)) || Number(portrait.quantity) <= 0)) {
            alert("Each framed portrait must have a valid size and positive quantity.");
            return false;
        }
        if (!thankYouCards || isNaN(Number(thankYouCards)) || Number(thankYouCards) <= 0) {
            alert("Thank You Cards must be a valid positive number.");
            return false;
        }
        return true;
    };

    // Handle form submission to update the package
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const updatedPackageData = {
            name,
            servicesIncluded,
            additionalItems: {
                editedImages,
                uneditedImages,
                albums,
                framedPortraits,
                thankYouCards: parseInt(thankYouCards),
            },
            investment: parseInt(investment),
            packageType,
        };

        try {
            const res = await fetch(`http://localhost:8080/api/packages/${unwrappedParams?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPackageData),
            });

            if (res.ok) {
                alert("Package updated successfully!");
                router.push("/packages/Ad_View"); // Redirect to package list
            } else {
                alert("Failed to update package.");
            }
        } catch (error) {
            alert("An error occurred while updating the package.");
            console.error(error);
        }
    };

    // Handle changes in form fields
    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const updatedServices = [...servicesIncluded];
        updatedServices[index] = value;
        setServicesIncluded(updatedServices);
    };

    const addService = () => setServicesIncluded([...servicesIncluded, ""]);

    const removeService = (index: number) => {
        const updatedServices = servicesIncluded.filter((_, i) => i !== index);
        setServicesIncluded(updatedServices);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {loading ? (
                    <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-8">
                            <CameraIcon className="h-8 w-8 text-blue-500" />
                            <h1 className="text-3xl font-bold text-foreground">
                                Edit Package
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-card rounded-lg border shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                                        <h2 className="text-xl font-semibold text-card-foreground">Basic Information</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                                Package Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="investment" className="block text-sm font-medium text-foreground mb-1">
                                                Investment (LKR)
                                            </label>
                                            <input
                                                type="number"
                                                id="investment"
                                                value={investment}
                                                onChange={(e) => setInvestment(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="packageType" className="block text-sm font-medium text-foreground mb-1">
                                                Package Type
                                            </label>
                                            <input
                                                type="text"
                                                id="packageType"
                                                value={packageType}
                                                onChange={(e) => setPackageType(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="bg-card rounded-lg border shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckIcon className="h-5 w-5 text-blue-500" />
                                        <h2 className="text-xl font-semibold text-card-foreground">Services Included</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {servicesIncluded.map((service, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={service}
                                                    onChange={(e) => {
                                                        const newServices = [...servicesIncluded];
                                                        newServices[index] = e.target.value;
                                                        setServicesIncluded(newServices);
                                                    }}
                                                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter service"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newServices = servicesIncluded.filter((_, i) => i !== index);
                                                        setServicesIncluded(newServices);
                                                    }}
                                                    className="p-2 text-destructive hover:text-destructive/90 transition-colors"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setServicesIncluded([...servicesIncluded, ""])}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            Add Service
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Items */}
                                <div className="bg-card rounded-lg border shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-card-foreground mb-6">Additional Items</h2>
                                    
                                    {/* Images */}
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <PhotoIcon className="h-5 w-5 text-amber-500" />
                                                <h3 className="font-medium text-foreground">Images</h3>
                                            </div>
                                            <div>
                                                <label htmlFor="editedImages" className="block text-sm font-medium text-foreground mb-1">
                                                    Edited Images
                                                </label>
                                                <input
                                                    type="text"
                                                    id="editedImages"
                                                    value={editedImages}
                                                    onChange={(e) => setEditedImages(e.target.value)}
                                                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="uneditedImages" className="block text-sm font-medium text-foreground mb-1">
                                                    Unedited Images
                                                </label>
                                                <input
                                                    type="text"
                                                    id="uneditedImages"
                                                    value={uneditedImages}
                                                    onChange={(e) => setUneditedImages(e.target.value)}
                                                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Albums */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpenIcon className="h-5 w-5 text-indigo-500" />
                                                <h3 className="font-medium text-foreground">Albums</h3>
                                            </div>
                                            {albums.map((album, index) => (
                                                <div key={index} className="grid gap-4 sm:grid-cols-3">
                                                    <input
                                                        type="text"
                                                        value={album.size}
                                                        onChange={(e) => {
                                                            const newAlbums = [...albums];
                                                            newAlbums[index] = { ...album, size: e.target.value };
                                                            setAlbums(newAlbums);
                                                        }}
                                                        placeholder="Size"
                                                        className="rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={album.type}
                                                        onChange={(e) => {
                                                            const newAlbums = [...albums];
                                                            newAlbums[index] = { ...album, type: e.target.value };
                                                            setAlbums(newAlbums);
                                                        }}
                                                        placeholder="Type"
                                                        className="rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={album.spreadCount}
                                                            onChange={(e) => {
                                                                const newAlbums = [...albums];
                                                                newAlbums[index] = { ...album, spreadCount: e.target.value };
                                                                setAlbums(newAlbums);
                                                            }}
                                                            placeholder="Spread Count"
                                                            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newAlbums = albums.filter((_, i) => i !== index);
                                                                setAlbums(newAlbums);
                                                            }}
                                                            className="p-2 text-destructive hover:text-destructive/90 transition-colors"
                                                        >
                                                            <XMarkIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setAlbums([...albums, { size: "", type: "", spreadCount: "" }])}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                                Add Album
                                            </button>
                                        </div>

                                        {/* Framed Portraits */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <PhotoIcon className="h-5 w-5 text-amber-500" />
                                                <h3 className="font-medium text-foreground">Framed Portraits</h3>
                                            </div>
                                            {framedPortraits.map((portrait, index) => (
                                                <div key={index} className="grid gap-4 sm:grid-cols-2">
                                                    <input
                                                        type="text"
                                                        value={portrait.size}
                                                        onChange={(e) => {
                                                            const newPortraits = [...framedPortraits];
                                                            newPortraits[index] = { ...portrait, size: e.target.value };
                                                            setFramedPortraits(newPortraits);
                                                        }}
                                                        placeholder="Size"
                                                        className="rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={portrait.quantity}
                                                            onChange={(e) => {
                                                                const newPortraits = [...framedPortraits];
                                                                newPortraits[index] = { ...portrait, quantity: e.target.value };
                                                                setFramedPortraits(newPortraits);
                                                            }}
                                                            placeholder="Quantity"
                                                            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPortraits = framedPortraits.filter((_, i) => i !== index);
                                                                setFramedPortraits(newPortraits);
                                                            }}
                                                            className="p-2 text-destructive hover:text-destructive/90 transition-colors"
                                                        >
                                                            <XMarkIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setFramedPortraits([...framedPortraits, { size: "", quantity: "" }])}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                                Add Portrait
                                            </button>
                                        </div>

                                        {/* Thank You Cards */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GiftIcon className="h-5 w-5 text-purple-500" />
                                                <h3 className="font-medium text-foreground">Thank You Cards</h3>
                                            </div>
                                            <input
                                                type="text"
                                                value={thankYouCards}
                                                onChange={(e) => setThankYouCards(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter quantity"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600"
                                >
                                    <PencilSquareIcon className="h-4 w-4" />
                                    Update Package
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditPackage;