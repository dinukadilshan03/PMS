'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Album } from "@/app/Album-Portfolio/types/album";
import {jsPDF} from "jspdf";

export default function AlbumList() {

    const [albums, setAlbums] = useState<Album[]>([]); // All albums from backend
    const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]); // Filtered albums based on search query
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    //Generate PDF in frontend method
    const generatePDF = (album: Album) => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const maxImgWidth = pageWidth - margin * 2;
        const maxImgHeight = pageHeight - margin * 2 - 30; // Leave space for header

        let loadedImages = 0;
        let currentPage = 0;
        let yPosition = 40;

        // Add album header to first page
        doc.setFontSize(18);
        doc.text(`Album Name: ${album.name}`, margin, 15);
        doc.setFontSize(12);
        doc.text(`Description: ${album.description}`, margin, 25);

        album.images.forEach((image, index) => {
            const img = new Image();
            img.src = `http://localhost:8080/uploads/${image}`;

            img.onload = () => {
                loadedImages++;

                // Calculate image dimensions while maintaining aspect ratio
                let imgWidth = img.width;
                let imgHeight = img.height;

                // Scale image to fit within the allowed width and height
                if (imgWidth > maxImgWidth) {
                    const ratio = maxImgWidth / imgWidth;
                    imgWidth = maxImgWidth;
                    imgHeight = imgHeight * ratio;
                }

                if (imgHeight > maxImgHeight) {
                    const ratio = maxImgHeight / imgHeight;
                    imgHeight = maxImgHeight;
                    imgWidth = imgWidth * ratio;
                }

                // Check if we need a new page
                if (yPosition + imgHeight > pageHeight - margin) {
                    doc.addPage();
                    currentPage++;
                    yPosition = margin;
                }

                // Calculate the X and Y positions to center the image
                const xPosition = (pageWidth - imgWidth) / 2; // Horizontal center
                const verticalSpace = 20; // Space between images vertically
                yPosition += verticalSpace; // Adjust Y position for the current image

                // Add image to current page
                doc.addImage(img, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + verticalSpace; // Update Y position for the next image

                // If this is the last image, save the PDF
                if (loadedImages === album.images.length) {
                    doc.save(`album_${album.name}.pdf`);
                }
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${image}`);
                loadedImages++;

                // If this was the last image, save anyway
                if (loadedImages === album.images.length) {
                    doc.save(`album_${album.name}.pdf`);
                }
            };
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);

        if (value.trim() === "") {
            // If the search bar is cleared, show all albums
            setFilteredAlbums(albums);
        } else {
            // Filter albums based on the search query
            const filtered = albums.filter((album: any) =>
                album.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAlbums(filtered);
        }
    }

    // Fetch all albums from backend
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/albums');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAlbums(data);
                setFilteredAlbums(data);  // Initialize filteredAlbums with all albums
            } catch (err) {
                console.error('Error fetching albums:', err);
                setError('Failed to load albums');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    // Delete album from backend
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove album from the state
            setAlbums(albums.filter(album => album.id !== id));
            setFilteredAlbums(filteredAlbums.filter(album => album.id !== id));

        } catch (err) {
            console.error('Error deleting album:', err);
            setError('Failed to delete album');
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-xl text-gray-500">Loading albums...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500 text-xl">{error}</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Albums</h2>
                <Link
                    href="/Album-Portfolio/album/pages/create/"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors ease-in-out"
                >
                    Add a New Album
                </Link>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    id="search"
                    name="search"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search albums..."
                />
                <div className="absolute top-0 right-0 p-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6"/>
                    </svg>

                </div>
            </div>

            {filteredAlbums.length === 0 ? (
                <p className="text-gray-500 text-xl">No albums found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAlbums.map((album) => (
                        <div key={album.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <Link href={`/Album-Portfolio/album/pages/${album.id}`}>
                                {/* Album Images Grid */}
                                {album.images?.length > 0 && (
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        {album.images.slice(0, 4).map((image, index) => (
                                            <div key={index} className="aspect-square bg-gray-100 overflow-hidden rounded-md">
                                                <img
                                                    src={`http://localhost:8080/uploads/${image}`}
                                                    alt={`Album ${album.name} image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        console.error('Error loading image:', image);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Link>

                            {/* Album Info */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800">{album.name}</h3>
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{album.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs text-gray-500">
                                        {album.category} • {album.location}
                                    </span>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors ease-in-out text-sm"
                                        onClick={() => handleDelete(album.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={()=>generatePDF(album)}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
