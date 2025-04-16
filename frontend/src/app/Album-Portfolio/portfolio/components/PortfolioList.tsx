'use client'

import {useEffect, useState} from "react";
import {Portfolio} from "@/app/Album-Portfolio/types/portfolio";

export default function PortfolioList(){

    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    //Portfolios Fetching Function
    useEffect(() => {

        const fetchPortfolios = async () =>{

            const response = await fetch("http://localhost:8080/api/portfolio");

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPortfolios(data);
            console.log(data);
        }
        fetchPortfolios();
    }, [])

    return(
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Our Photography Portfolios
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Explore our collection of stunning photography work
                    </p>
                </div>

                {portfolios.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No portfolios found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolios.map((portfolio) => (
                            <div
                                key={portfolio.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={`http://localhost:8080/uploads/${portfolio.imageUrl}`}
                                        alt={portfolio.albumName}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {portfolio.albumName}
                                        </h2>
                                        <span
                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                                            {portfolio.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {portfolio.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            {portfolio.photographerName}
                                        </span>
                                        <span>
                                            {new Date(portfolio.dateUploaded).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}