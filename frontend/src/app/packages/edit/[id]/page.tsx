"use client"; // Important to mark this as a client component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // Correct import for routing

const EditPackage = ({ params }: { params: { id: string } }) => {
    const [name, setName] = useState("");
    const [investment, setInvestment] = useState("");
    const [packageType, setPackageType] = useState("");
    const [servicesIncluded, setServicesIncluded] = useState<string[]>([]);
    const [editedImages, setEditedImages] = useState("");
    const [uneditedImages, setUneditedImages] = useState("");
    const [albums, setAlbums] = useState([{ size: "", type: "", spreadCount: "" }]);
    const [framedPortraits, setFramedPortraits] = useState([{ size: "", quantity: "" }]);
    const [thankYouCards, setThankYouCards] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch the package details when the component loads
    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/packages/${params.id}`);
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
    }, [params.id]);

    // Handle form submission to update the package
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const res = await fetch(`http://localhost:8080/api/packages/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPackageData),
            });

            if (res.ok) {
                alert("Package updated successfully!");
                router.push("/"); // Redirect to homepage or package list
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
        <div>
            <h1>Edit Photography Package</h1>
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

                <button type="submit">Update Package</button>
            </form>
        </div>
    );
};

export default EditPackage;
