'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Package {
    id: string;
    name: string;
}

const API_BASE_URL = 'http://localhost:8080';

export default function CreateFeedbackPage() {
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        clientEmail: '',
        content: '',
        rating: 5,
        packageName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [packages, setPackages] = useState<Package[]>([]);
    const router = useRouter();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        const userEmail = sessionStorage.getItem('email');
        const userRole = sessionStorage.getItem('role');
        
        if (!userId) {
            router.push('/login');
            return;
        }

        if (userEmail) {
            setFormData(prev => ({
                ...prev,
                clientId: userId || '',
                clientEmail: userEmail,
                clientName: userRole || 'User'
            }));
        }
    }, [router]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/packages');
                if (!response.ok) throw new Error('Failed to fetch packages');
                const data = await response.json();
                setPackages(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch packages');
            }
        };
        fetchPackages();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === "rating") {
                return { ...prev, [name]: Math.max(1, Math.min(5, parseInt(value))) };
            }
            if (name === "clientName" && /\d/.test(value)) {
                return prev;
            }
            if (name === "content" && value.length > 500) {
                return prev;
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.clientName.trim()) {
            setError('Client name is required.');
            return;
        }
        if (!formData.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Invalid email format.');
            return;
        }
        try {
            setLoading(true);
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                setError('You must be logged in to submit feedback.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Userid': userId
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message?.includes('Only customers who have booked a session can add feedback')) {
                    setError('You must book a session before you can leave feedback. Please make a booking first.');
                    return;
                }
                throw new Error(errorData.message || 'Failed to create feedback');
            }
            
            router.push('/feedback');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Feedback</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Package</label>
                    <select
                        name="packageName"
                        value={formData.packageName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a package</option>
                        {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                        type="range"
                        name="rating"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                    <div className="flex justify-between">
                        <span>1 ★</span>
                        <span>2 ★</span>
                        <span>3 ★</span>
                        <span>4 ★</span>
                        <span>5 ★</span>
                    </div>
                    <div className="text-center mt-1">
                        Current: {formData.rating} ★
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Feedback Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/feedback')}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 