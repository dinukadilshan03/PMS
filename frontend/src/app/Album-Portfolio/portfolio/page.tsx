// app/portfolio/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {Portfolio} from "@/app/Album-Portfolio/types/portfolio";

export default function PortfolioList() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/portfolio');
                if (!response.ok) throw new Error('Failed to fetch portfolios');
                const data = await response.json();
                setPortfolios(data);
                console.log(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/portfolio/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete portfolio');
            setPortfolios(portfolios.filter(p => p.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Portfolio Gallery</h1>
                <Link href="portfolio/create/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add New Portfolio
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map(portfolio => (
                    <div key={portfolio.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 overflow-hidden">
                            <img
                                src={`http://localhost:8080/uploads/${portfolio.imageUrl}`}
                                alt={portfolio.albumName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{portfolio.albumName}</h2>
                            <p className="text-gray-600 mb-2">{portfolio.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{portfolio.photographerName}</span>
                                <span className="text-sm text-gray-500">{portfolio.category}</span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/portfolio/edit/${portfolio.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(portfolio.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}