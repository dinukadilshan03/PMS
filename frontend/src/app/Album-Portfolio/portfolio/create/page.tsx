'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePortfolio() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        albumName: '',
        description: '',
        photographerName: '',
        category: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('albumName', formData.albumName);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('photographerName', formData.photographerName);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('image', image);

        try {
            const response = await fetch('http://localhost:8080/api/portfolio', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to create portfolio');
            } else {
                alert("Upload Successful");
            }
            router.push('/Album-Portfolio/portfolio/');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New Portfolio</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Album Name</label>
                    <input
                        type="text"
                        name="albumName"
                        value={formData.albumName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Photographer Name</label>
                    <select
                        name="photographerName"
                        value={formData.photographerName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a photographer</option>
                        <option value="Dinuka">Dinuka</option>
                        <option value="Asinu">Asinu</option>
                        <option value="Rashii">Rashii</option>
                        <option value="Niumi">Niumi</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Party">Party</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Landscape">Landscape</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? 'Creating...' : 'Create Portfolio'}
                </button>
            </form>
        </div>
    );
}