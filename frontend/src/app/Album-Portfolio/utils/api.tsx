const url = "http://localhost:8080/api/albums";

import { Album } from "@/app/Album-Portfolio/types/types";

export const fetchAlbums = async (): Promise<Album[]> => {
    try {
        const response = await fetch(`${url}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch albums: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching albums:", error);
        throw error;
    }
};

export const uploadAlbum = async (albumData: FormData): Promise<Album> => {
    try {
        const response = await fetch(`${url}`, {
            method: "POST",
            body: albumData,
        });
        if (!response.ok) {
            throw new Error(`Failed to upload album: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error uploading album:", error);
        throw error;
    }
};