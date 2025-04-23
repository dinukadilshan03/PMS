'use client'

import {useEffect, useState} from "react";
import {Portfolio} from "@/app/Album-Portfolio/types/portfolio";
import {useRouter} from "next/navigation";

export default function PortfolioList() {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const handleSearch = (value: string) => {
        setSearch(value);

        if (value.trim() === "") {

            setFilteredPortfolios(portfolios);
        } else {

            const filtered = portfolios.filter((portfolio: any) =>
                portfolio.albumName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPortfolios(filtered);
        }
    }

    // Portfolios Fetching Function
    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/portfolio");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPortfolios(data);
                setFilteredPortfolios(data)
                console.log(data)
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchPortfolios();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio?")) return;

        setIsDeleting(id);
        try {
            const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPortfolios(portfolios.filter((portfolio) => portfolio.id !== id));
            } else {
                alert('Portfolio deletion failed');
                console.error(`Failed to delete. Status: ${response.status}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the portfolio.');
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'portrait':
                return 'bg-purple-100 text-purple-800';
            case 'wedding':
                return 'bg-pink-100 text-pink-800';
            case 'commercial':
                return 'bg-blue-100 text-blue-800';
            case 'sports':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Photography Portfolios
                        </span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
                        Discover our collection of breathtaking photography work
                    </p>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search portfolios..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id={"searchBar"}
                            name={"searchBar"}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <button
                        onClick={() => router.push("/Album-Portfolio/portfolio/pages/create/")}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Portfolio
                    </button>
                </div>

                {filteredPortfolios.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No portfolios found</h3>
                        <p className="text-gray-500 mb-6">Create your first portfolio to get started</p>
                        <button
                            onClick={() => router.push("/Album-Portfolio/portfolio/pages/create/")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Portfolio
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPortfolios.map((portfolio) => (
                            <div
                                key={portfolio.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-64 overflow-hidden group">
                                    <img
                                        src={`http://localhost:8080/uploads/${portfolio.imageUrl}`}
                                        alt={portfolio.albumName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button
                                            onClick={() => router.push(`/Album-Portfolio/portfolio/pages/${portfolio.id}`)}
                                            className="mr-2 px-4 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(portfolio.id)}
                                            disabled={isDeleting === portfolio.id}
                                            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isDeleting === portfolio.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isDeleting === portfolio.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xl font-bold text-gray-800 truncate">
                                            {portfolio.albumName}
                                        </h2>
                                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold tracking-wide ${getCategoryColor(portfolio.category)}`}>
                                            {portfolio.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {portfolio.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">{portfolio.photographerName}</span>
                                        </div>
                                        <div className="text-gray-500">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(portfolio.dateUploaded).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}