'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Album } from "@/app/Album-Portfolio/types/album";

export default function SingleAlbumViewUser() {
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const { albumID } = useParams();

    useEffect(() => {
        const fetchAlbum = async (albumID: string) => {
            try {
                const response = await fetch(`http://localhost:8080/api/albums/${albumID}`);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                setAlbum(data);
            } catch (error) {
                console.error("Failed to fetch album:", error);
            } finally {
                setLoading(false);
            }
        };

        if (albumID) {
            fetchAlbum(albumID as string);
        }
    }, [albumID]);

    const openImageViewer = (index: number) => {
        setCurrentImageIndex(index);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when viewer is open
    };

    const closeImageViewer = () => {
        setCurrentImageIndex(null);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (currentImageIndex === null || !album) return;

        if (direction === 'prev') {
            setCurrentImageIndex(prev =>
                prev === 0 ? album.images.length - 1 : (prev as number) - 1
            );
        } else {
            setCurrentImageIndex(prev =>
                prev === album.images.length - 1 ? 0 : (prev as number) + 1
            );
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        if (currentImageIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeImageViewer();
            } else if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            } else if (e.key === 'ArrowRight') {
                navigateImage('next');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentImageIndex]);

    // Show just the background first while loading
    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="fixed inset-0 z-0 bg-gray-200 animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Background Images Section - Shows first */}
            <div className="fixed inset-0 z-0">
                {album && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(http://localhost:8080/uploads/${album.coverImage})`
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </>
                )}
            </div>

            {/* Content Section */}
            {album && (
                <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-white">
                    {/* Album Header */}
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/3 flex flex-col items-center">
                            <img
                                src={`http://localhost:8080/uploads/${album.coverImage}`}
                                alt="Cover"
                                className="w-full max-w-md h-auto rounded-xl shadow-2xl border-4 border-white/20 hover:border-white/40 transition-all duration-300"
                            />
                        </div>

                        <div className="lg:w-2/3 space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                                {album.name}
                            </h1>

                            <p className="text-lg text-gray-200 max-w-3xl">
                                {album.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-gray-300">Location</p>
                                    <p className="text-lg font-medium">{album.location}</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-gray-300">Category</p>
                                    <p className="text-lg font-medium">{album.category}</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-gray-300">Release Date</p>
                                    <p className="text-lg font-medium">
                                        {new Date(album.releaseDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-gray-300">Status</p>
                                    <p className="text-lg font-medium capitalize">{album.status.toLowerCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="max-w-7xl mx-auto mt-24">
                        <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {album.images.map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className="relative group overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                                    onClick={() => openImageViewer(index)}
                                >
                                    <img
                                        src={`http://localhost:8080/uploads/${image}`}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-medium">Image {index + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Full-screen Image Viewer */}
            {currentImageIndex !== null && album && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <button
                        onClick={closeImageViewer}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                        aria-label="Close image viewer"
                    >
                        &times;
                    </button>

                    <button
                        onClick={() => navigateImage('prev')}
                        className="absolute left-4 md:left-8 text-white text-4xl hover:text-gray-300 transition-colors p-4"
                        aria-label="Previous image"
                    >
                        &larr;
                    </button>

                    <div className="relative max-w-full max-h-full">
                        <img
                            src={`http://localhost:8080/uploads/${album.images[currentImageIndex]}`}
                            alt={`Image ${currentImageIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                            Image {currentImageIndex + 1} of {album.images.length}
                        </div>
                    </div>

                    <button
                        onClick={() => navigateImage('next')}
                        className="absolute right-4 md:right-8 text-white text-4xl hover:text-gray-300 transition-colors p-4"
                        aria-label="Next image"
                    >
                        &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}