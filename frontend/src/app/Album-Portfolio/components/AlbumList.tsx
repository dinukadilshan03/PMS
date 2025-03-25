'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Album {
    id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    status: string;
}

export default function AlbumList() {
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        axios.get('/api/albums')
            .then((response) => setAlbums(response.data))
            .catch((error) => console.error('Error fetching albums:', error));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/albums/${id}`);
            setAlbums(albums.filter(album => album.id !== id));
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Album List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                    <div key={album.id} className="bg-white shadow-md p-4 rounded-md">
                        <h3 className="text-lg font-bold">{album.name}</h3>
                        <p className="text-gray-600">{album.description}</p>
                        <p className="text-sm text-gray-500">{album.category} | {album.location}</p>
                        <button
                            className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDelete(album.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
