"use client";
import { useEffect, useState } from "react";
import { fetchAlbums } from "@/app/Album-Portfolio/utils/api";
import { Album } from "@/app/Album-Portfolio/types/types";

export default function AlbumsShow() {
    // State to store the list of albums
    const [albums, setAlbums] = useState<Album[]>([]);

    // Fetch albums when the component mounts
    useEffect(() => {
        const loadAlbums = async () => {
            try {
                const data = await fetchAlbums();
                setAlbums(data);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        loadAlbums();
    }, []);

    return (
        <div>
            <h1>Albums</h1>
            <div>
                {albums.map((album) => (
                    <div key={album.id}>
                        <h2>{album.name}</h2>
                        <p>{album.description}</p>
                        <p>Category: {album.category}</p>
                        <p>Location: {album.location}</p>
                        <p>Status: {album.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}