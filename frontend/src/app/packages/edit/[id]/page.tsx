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
        <div className="min-h-screen bg-[#e9e5dc] py-16 px-4 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem_1rem_2.5rem_1rem] shadow-lg p-0" style={{ boxShadow: '0 8px 32px rgba(45,41,38,0.07)' }}>
                {/* Section Heading */}
                <div className="px-10 pt-10 pb-2">
                    <h1 className="text-3xl font-serif font-light text-[#222] mb-2 tracking-wide">edit package</h1>
                    <div className="w-16 h-1 bg-black mb-6" />
                    <p className="text-center text-base text-[#444] mb-8 font-light">Update the details of your package below.</p>
                </div>
                <form onSubmit={handleSubmit} className="px-10 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-8">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-xs font-medium text-[#222] tracking-widest uppercase">Package Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter package name"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="investment" className="text-xs font-medium text-[#222] tracking-widest uppercase">Investment (LKR)</label>
                            <input
                                type="number"
                                id="investment"
                                value={investment}
                                onChange={(e) => setInvestment(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter investment"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="packageType" className="text-xs font-medium text-[#222] tracking-widest uppercase">Package Type</label>
                            <input
                                type="text"
                                id="packageType"
                                value={packageType}
                                onChange={(e) => setPackageType(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter package type"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#222] tracking-widest uppercase">Thank You Cards</label>
                            <input
                                type="text"
                                value={thankYouCards}
                                onChange={(e) => setThankYouCards(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>
                    {/* Services Included */}
                    <div className="mb-8">
                        <label className="block text-xs font-medium text-[#222] tracking-widest uppercase mb-2">Services Included</label>
                        <div className="flex flex-col gap-2">
                            {servicesIncluded.map((service, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={service}
                                        onChange={(e) => handleServiceChange(e, index)}
                                        className="flex-1 border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                        placeholder="Enter service"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeService(index)}
                                        className="p-1 text-[#bbb] hover:text-red-500 transition"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addService}
                                className="inline-flex items-center gap-2 text-xs font-medium text-[#b6a489] hover:text-[#222] transition mt-2"
                            >
                                <PlusIcon className="h-4 w-4" /> Add Service
                            </button>
                        </div>
                    </div>
                    {/* Additional Items */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#222] tracking-widest uppercase">Edited Images</label>
                            <input
                                type="text"
                                value={editedImages}
                                onChange={(e) => setEditedImages(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter edited images"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#222] tracking-widest uppercase">Unedited Images</label>
                            <input
                                type="text"
                                value={uneditedImages}
                                onChange={(e) => setUneditedImages(e.target.value)}
                                className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                placeholder="Enter unedited images"
                                required
                            />
                        </div>
                    </div>
                    {/* Albums */}
                    <div className="mb-8">
                        <label className="block text-xs font-medium text-[#222] tracking-widest uppercase mb-2">Albums</label>
                        <div className="flex flex-col gap-2">
                            {albums.map((album, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                    <input
                                        type="text"
                                        value={album.size}
                                        onChange={(e) => {
                                            const newAlbums = [...albums];
                                            newAlbums[index] = { ...album, size: e.target.value };
                                            setAlbums(newAlbums);
                                        }}
                                        placeholder="Size"
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
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
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={album.spreadCount}
                                            onChange={(e) => {
                                                const newAlbums = [...albums];
                                                newAlbums[index] = { ...album, spreadCount: e.target.value };
                                                setAlbums(newAlbums);
                                            }}
                                            placeholder="Spread Count"
                                            className="flex-1 border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newAlbums = albums.filter((_, i) => i !== index);
                                                setAlbums(newAlbums);
                                            }}
                                            className="p-1 text-[#bbb] hover:text-red-500 transition"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setAlbums([...albums, { size: "", type: "", spreadCount: "" }])}
                                className="inline-flex items-center gap-2 text-xs font-medium text-[#b6a489] hover:text-[#222] transition mt-2"
                            >
                                <PlusIcon className="h-4 w-4" /> Add Album
                            </button>
                        </div>
                    </div>
                    {/* Framed Portraits */}
                    <div className="mb-8">
                        <label className="block text-xs font-medium text-[#222] tracking-widest uppercase mb-2">Framed Portraits</label>
                        <div className="flex flex-col gap-2">
                            {framedPortraits.map((portrait, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2 items-center">
                                    <input
                                        type="text"
                                        value={portrait.size}
                                        onChange={(e) => {
                                            const newPortraits = [...framedPortraits];
                                            newPortraits[index] = { ...portrait, size: e.target.value };
                                            setFramedPortraits(newPortraits);
                                        }}
                                        placeholder="Size"
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={portrait.quantity}
                                            onChange={(e) => {
                                                const newPortraits = [...framedPortraits];
                                                newPortraits[index] = { ...portrait, quantity: e.target.value };
                                                setFramedPortraits(newPortraits);
                                            }}
                                            placeholder="Quantity"
                                            className="flex-1 border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPortraits = framedPortraits.filter((_, i) => i !== index);
                                                setFramedPortraits(newPortraits);
                                            }}
                                            className="p-1 text-[#bbb] hover:text-red-500 transition"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFramedPortraits([...framedPortraits, { size: "", quantity: "" }])}
                                className="inline-flex items-center gap-2 text-xs font-medium text-[#b6a489] hover:text-[#222] transition mt-2"
                            >
                                <PlusIcon className="h-4 w-4" /> Add Portrait
                            </button>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-center mt-10">
                        <button
                            type="submit"
                            className="w-64 py-3 rounded-full bg-[#a08c6b] text-white text-base font-serif tracking-widest uppercase shadow hover:bg-[#7c6a53] transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPackage;