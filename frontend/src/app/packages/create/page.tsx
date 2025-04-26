"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CameraIcon,
    PlusIcon,
    XMarkIcon,
    PhotoIcon,
    BookOpenIcon,
    GiftIcon,
    CheckIcon,
    ArrowLeftIcon
} from "@heroicons/react/20/solid";

const CreatePackage = () => {
    const [name, setName] = useState("");
    const [investment, setInvestment] = useState("");
    const [packageType, setPackageType] = useState("");
    const [servicesIncluded, setServicesIncluded] = useState<string[]>([]);
    const [editedImages, setEditedImages] = useState("");
    const [uneditedImages, setUneditedImages] = useState("");
    const [albums, setAlbums] = useState([{ size: "", type: "", spreadCount: "" }]);
    const [framedPortraits, setFramedPortraits] = useState([{ size: "", quantity: "" }]);
    const [thankYouCards, setThankYouCards] = useState("");
    const router = useRouter();

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
            alert("Each album must have a valid size, type, and spread count greater than or equal to 0.");
            return false;
        }
        if (framedPortraits.some(portrait => !portrait.size.trim() || isNaN(Number(portrait.quantity)) || Number(portrait.quantity) <= 0)) {
            alert("Each framed portrait must have a valid size and quantity.");
            return false;
        }
        if (!thankYouCards || isNaN(Number(thankYouCards)) || Number(thankYouCards) <= 0) {
            alert("Thank You Cards must be a valid positive number.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const packageData = {
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
            const res = await fetch("http://localhost:8080/api/packages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packageData),
            });

            if (res.ok) {
                alert("Package created successfully!");
                router.push("/packages/Ad_View");
            } else {
                alert("Failed to create package.");
            }
        } catch (error) {
            alert("An error occurred while creating the package.");
            console.error(error);
        }
    };

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

    const handleAlbumChange = (index: number, field: string, value: string) => {
        const newAlbums = [...albums];
        newAlbums[index] = { ...albums[index], [field]: value };
        setAlbums(newAlbums);
    };

    const handleRemoveAlbum = (index: number) => {
        const newAlbums = albums.filter((_, i) => i !== index);
        setAlbums(newAlbums);
    };

    const handleAddAlbum = () => setAlbums([...albums, { size: "", type: "", spreadCount: "" }]);

    const handlePortraitChange = (index: number, field: string, value: string) => {
        const newPortraits = [...framedPortraits];
        newPortraits[index] = { ...framedPortraits[index], [field]: value };
        setFramedPortraits(newPortraits);
    };

    const handleRemovePortrait = (index: number) => {
        const newPortraits = framedPortraits.filter((_, i) => i !== index);
        setFramedPortraits(newPortraits);
    };

    const handleAddPortrait = () => setFramedPortraits([...framedPortraits, { size: "", quantity: "" }]);

    return (
        <div className="min-h-screen bg-[#e9e5dc] py-16 px-4 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem_1rem_2.5rem_1rem] shadow-lg p-0" style={{ boxShadow: '0 8px 32px rgba(45,41,38,0.07)' }}>
                {/* Section Heading */}
                <div className="px-10 pt-10 pb-2">
                    <h1 className="text-3xl font-serif font-light text-[#222] mb-2 tracking-wide">create package</h1>
                    <div className="w-16 h-1 bg-black mb-6" />
                    <p className="text-center text-base text-[#444] mb-8 font-light">Please fill out the form to create a new package.</p>
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
                                        onChange={(e) => handleAlbumChange(index, 'size', e.target.value)}
                                        placeholder="Size"
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                    />
                                    <input
                                        type="text"
                                        value={album.type}
                                        onChange={(e) => handleAlbumChange(index, 'type', e.target.value)}
                                        placeholder="Type"
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={album.spreadCount}
                                            onChange={(e) => handleAlbumChange(index, 'spreadCount', e.target.value)}
                                            placeholder="Spread Count"
                                            className="flex-1 border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAlbum(index)}
                                            className="p-1 text-[#bbb] hover:text-red-500 transition"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddAlbum}
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
                                        onChange={(e) => handlePortraitChange(index, 'size', e.target.value)}
                                        placeholder="Size"
                                        className="border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={portrait.quantity}
                                            onChange={(e) => handlePortraitChange(index, 'quantity', e.target.value)}
                                            placeholder="Quantity"
                                            className="flex-1 border-b border-[#bbb] bg-transparent px-0 py-2 text-[#222] focus:outline-none focus:border-black transition placeholder:text-[#bbb]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePortrait(index)}
                                            className="p-1 text-[#bbb] hover:text-red-500 transition"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddPortrait}
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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePackage;