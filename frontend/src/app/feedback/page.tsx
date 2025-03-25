// app/bookings/feedback/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Feedback {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    content: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

const API_BASE_URL = 'http://localhost:8080'; // Update with your backend URL

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        clientId: 'demo-user', // Replace with actual client ID in real app
        clientName: '',
        clientEmail: '',
        content: '',
        rating: 5
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all active feedbacks
    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/feedbacks/active`);
            if (!response.ok) throw new Error('Failed to fetch feedbacks');
            const data = await response.json();
            setFeedbacks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const url = editingId
                ? `${API_BASE_URL}/api/feedbacks/${editingId}`
                : `${API_BASE_URL}/api/feedbacks`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} feedback`);

            await fetchFeedbacks(); // Refresh the list
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (feedback: Feedback) => {
        setEditingId(feedback.id);
        setFormData({
            clientId: feedback.clientId,
            clientName: feedback.clientName,
            clientEmail: feedback.clientEmail,
            content: feedback.content,
            rating: feedback.rating
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/feedbacks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete feedback');

            await fetchFeedbacks(); // Refresh the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            clientId: 'demo-user',
            clientName: '',
            clientEmail: '',
            content: '',
            rating: 5
        });
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Feedback Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Feedback Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Feedback' : 'Add New Feedback'}
                </h2>
                <form onSubmit={handleSubmit}>
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
                            {loading ? 'Processing...' : editingId ? 'Update Feedback' : 'Submit Feedback'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={loading}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Feedback List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">All Feedbacks</h2>

                {loading && feedbacks.length === 0 ? (
                    <p className="text-center py-4">Loading feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-gray-500">No feedbacks yet.</p>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.map(feedback => (
                            <div key={feedback.id} className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{feedback.clientName}</h3>
                                        <p className="text-sm text-gray-600">{feedback.clientEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(feedback)}
                                            disabled={loading}
                                            className="text-blue-600 hover:text-blue-800 text-sm disabled:text-blue-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            disabled={loading}
                                            className="text-red-600 hover:text-red-800 text-sm disabled:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="text-yellow-500">
                                        {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                                    </div>
                                    <p className="mt-1">{feedback.content}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Created: {new Date(feedback.createdAt).toLocaleString()}
                                    </p>
                                    {feedback.updatedAt !== feedback.createdAt && (
                                        <p className="text-xs text-gray-500">
                                            Updated: {new Date(feedback.updatedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}