"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import '../create/page.css';

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
                router.push("/");
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="max-w-5xl w-full bg-white p-10 rounded-lg shadow-lg"> {/* Changed from max-w-4xl to max-w-5xl */}
                <h1 className="text-3xl font-bold text-center mb-8">Create a New Photography Package</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Package Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter package name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Investment (in LKR):</label>
                        <input
                            type="number"
                            value={investment}
                            onChange={(e) => setInvestment(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter investment amount"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Package Type:</label>
                        <input
                            type="text"
                            value={packageType}
                            onChange={(e) => setPackageType(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter package type"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Services Included:</label>
                        {servicesIncluded.map((service, index) => (
                            <div key={index} className="flex mb-4">
                                <input
                                    type="text"
                                    value={service}
                                    onChange={(e) => handleServiceChange(e, index)}
                                    className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Service #${index + 1}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeService(index)}
                                    className="ml-4 p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addService}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                            Add Service
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Edited Images:</label>
                        <input
                            type="text"
                            value={editedImages}
                            onChange={(e) => setEditedImages(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter edited images count"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Unedited Images:</label>
                        <input
                            type="text"
                            value={uneditedImages}
                            onChange={(e) => setUneditedImages(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter unedited images count"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Albums:</label>
                        {albums.map((album, index) => (
                            <div key={index} className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Size"
                                    value={album.size}
                                    onChange={(e) => {
                                        const updatedAlbums = [...albums];
                                        updatedAlbums[index].size = e.target.value;
                                        setAlbums(updatedAlbums);
                                    }}
                                    className="w-1/3 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Type"
                                    value={album.type}
                                    onChange={(e) => {
                                        const updatedAlbums = [...albums];
                                        updatedAlbums[index].type = e.target.value;
                                        setAlbums(updatedAlbums);
                                    }}
                                    className="w-1/3 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Spread Count"
                                    value={album.spreadCount}
                                    onChange={(e) => {
                                        const updatedAlbums = [...albums];
                                        updatedAlbums[index].spreadCount = e.target.value;
                                        setAlbums(updatedAlbums);
                                    }}
                                    className="w-1/3 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setAlbums([...albums, { size: "", type: "", spreadCount: "" }])
                            }
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Add Album
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Framed Portraits:</label>
                        {framedPortraits.map((portrait, index) => (
                            <div key={index} className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Size"
                                    value={portrait.size}
                                    onChange={(e) => {
                                        const updatedPortraits = [...framedPortraits];
                                        updatedPortraits[index].size = e.target.value;
                                        setFramedPortraits(updatedPortraits);
                                    }}
                                    className="w-1/3 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={portrait.quantity}
                                    onChange={(e) => {
                                        const updatedPortraits = [...framedPortraits];
                                        updatedPortraits[index].quantity = e.target.value;
                                        setFramedPortraits(updatedPortraits);
                                    }}
                                    className="w-1/3 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setFramedPortraits([...framedPortraits, { size: "", quantity: "" }])
                            }
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Add Framed Portrait
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Thank You Cards:</label>
                        <input
                            type="number"
                            value={thankYouCards}
                            onChange={(e) => setThankYouCards(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Thank You Cards count"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none transition ease-in duration-200"
                    >
                        Create Package
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePackage;