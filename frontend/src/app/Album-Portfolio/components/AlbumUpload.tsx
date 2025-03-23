"use client";
import { useState } from "react";
import { uploadAlbum } from "@/app/Album-Portfolio/utils/api";

export default function AlbumUpload() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("location", location);
        formData.append("status", status);
        images.forEach((image) => formData.append("images", image));
        if (coverImage) {
            formData.append("coverImage", coverImage);
        }

        try {
            const album = await uploadAlbum(formData);
            alert("Album uploaded successfully!");
            console.log("Uploaded album:", album);
        } catch (error) {
            setError("Failed to upload album. Please try again.");
            console.error("Error uploading album:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Upload Album</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => {
                            if (e.target.files) {
                                setImages(Array.from(e.target.files));
                            }
                        }}
                        required
                    />
                </div>
                <div>
                    <label>Cover Image:</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setCoverImage(e.target.files[0]);
                            }
                        }}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Upload Album"}
                </button>
            </form>
        </div>
    );
}