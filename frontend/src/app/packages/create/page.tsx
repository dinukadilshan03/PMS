"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

    // Validate form fields
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
        if (!editedImages || isNaN(Number(editedImages)) || Number(editedImages) < 0) {
            alert("Edited images must be a valid number.");
            return false;
        }
        if (!uneditedImages || isNaN(Number(uneditedImages)) || Number(uneditedImages) < 0) {
            alert("Unedited images must be a valid number.");
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

    // Handle form submission
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
        <div>
            <h1>Create a New Photography Package</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Package Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Investment (in LKR):</label>
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Package Type:</label>
                    <input
                        type="text"
                        value={packageType}
                        onChange={(e) => setPackageType(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Services Included:</label>
                    {servicesIncluded.map((service, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => handleServiceChange(e, index)}
                                placeholder={`Service #${index + 1}`}
                                required
                            />
                            <button type="button" onClick={() => removeService(index)}>
                                Remove Service
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addService}>Add Service</button>
                </div>

                <div>
                    <label>Edited Images:</label>
                    <input
                        type="text"
                        value={editedImages}
                        onChange={(e) => setEditedImages(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Unedited Images:</label>
                    <input
                        type="text"
                        value={uneditedImages}
                        onChange={(e) => setUneditedImages(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Albums:</label>
                    {albums.map((album, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Size"
                                value={album.size}
                                onChange={(e) => {
                                    const updatedAlbums = [...albums];
                                    updatedAlbums[index].size = e.target.value;
                                    setAlbums(updatedAlbums);
                                }}
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
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => setAlbums([...albums, { size: "", type: "", spreadCount: "" }])}>
                        Add Album
                    </button>
                </div>

                <div>
                    <label>Framed Portraits:</label>
                    {framedPortraits.map((portrait, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Size"
                                value={portrait.size}
                                onChange={(e) => {
                                    const updatedPortraits = [...framedPortraits];
                                    updatedPortraits[index].size = e.target.value;
                                    setFramedPortraits(updatedPortraits);
                                }}
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
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => setFramedPortraits([...framedPortraits, { size: "", quantity: "" }])}>
                        Add Framed Portrait
                    </button>
                </div>

                <div>
                    <label>Thank You Cards:</label>
                    <input
                        type="number"
                        value={thankYouCards}
                        onChange={(e) => setThankYouCards(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Create Package</button>
            </form>
        </div>
    );
};

export default CreatePackage;
