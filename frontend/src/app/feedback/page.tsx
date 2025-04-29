// app/bookings/feedback/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Feedback {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    content: string;
    rating: number;
    packageName: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    reply?: string;
}

interface Package {
    id: string;
    name: string;
}

const API_BASE_URL = 'http://localhost:8080';

// Function to generate automatic reply based on rating and content
function generateReply(rating: number, content: string): string {
    if (rating >= 4) {
        return "Thank you for your positive feedback! We're glad you enjoyed our service.";
    } else if (rating === 3) {
        return "Thank you for your feedback. We appreciate your suggestions and will strive to improve.";
    } else {
        return "We're sorry to hear about your experience. We value your feedback and will work to address your concerns.";
    }
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        clientId: 'demo-user', // Replace with actual client ID in real app
        clientName: '',
        clientEmail: '',
        content: '',
        rating: 5,
        packageName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [packages, setPackages] = useState<Package[]>([]);
    const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Auto-fill form data from sessionStorage
    useEffect(() => {
        const userEmail = sessionStorage.getItem('email');
        const userRole = sessionStorage.getItem('role');
        
        if (userEmail) {
            setFormData(prev => ({
                ...prev,
                clientEmail: userEmail,
                clientName: userRole || 'User' // Use role as name if available, otherwise 'User'
            }));
        }
    }, []);

    // Fetch packages from backend
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

    // Fetch all active feedbacks
    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const url = selectedPackage
                ? `${API_BASE_URL}/api/feedbacks/active?packageName=${selectedPackage}`
                : `${API_BASE_URL}/api/feedbacks/active`;
            const response = await fetch(url); // Use the constructed URL here
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
    }, [selectedPackage]);

    useEffect(() => {
        setLoggedInUserEmail(sessionStorage.getItem('email'));
    }, []);

    const checkUserBookings = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/client`, {
                headers: {
                    'Userid': userId
                }
            });
            if (!response.ok) throw new Error('Failed to check bookings');
            const bookings = await response.json();
            return bookings.length > 0;
        } catch (err) {
            setError('Failed to verify your bookings. Please try again later.');
            return false;
        }
    };

    const handleAddFeedback = async () => {
        const hasBookings = await checkUserBookings();
        if (hasBookings) {
            router.push('/feedback/create');
        } else {
            setError('You must book a session before you can leave feedback. Please make a booking first.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            if (name === "rating") {
                // ✅ Ensure rating stays between 1 and 5
                return { ...prev, [name]: Math.max(1, Math.min(5, parseInt(value))) };
            }
            if (name === "clientName" && /\d/.test(value)) {
                // ✅ Prevent numbers in client name
                return prev;
            }

            if (name === "content" && value.length > 500) {
                // ✅ Limit feedback content length
                return prev;
            }
            return { ...prev, [name]: value };
        });
    };

    const handlePackageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPackage(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // ✅ Add: Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ✅ Add: Client-side validation before submission
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
            const url = editingId
                ? `${API_BASE_URL}/api/feedbacks/${editingId}`
                : `${API_BASE_URL}/api/feedbacks`;

            const method = editingId ? 'PUT' : 'POST';

            // Generate reply based on rating and content
            const reply = generateReply(formData.rating, formData.content);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, reply }),
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
            rating: feedback.rating,
            packageName: feedback.packageName
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
            rating: 5,
            packageName: ''
        });
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-center">Feedback Management</h1>
                {sessionStorage.getItem('userId') ? (
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={handleAddFeedback}
                    >
                        Add Feedback
                    </button>
                ) : (
                    <div className="text-gray-600">
                        Please <a href="/login" className="text-blue-600 hover:underline">login</a> to add feedback
                    </div>
                )}
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {/* Feedback List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">All Feedbacks</h2>
                    <select
                        value={selectedPackage}
                        onChange={handlePackageFilterChange}
                        className="p-2 border rounded"
                    >
                        <option value="">All Packages</option>
                        {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                                        <p className="text-sm text-gray-600">Package: {feedback.packageName}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {loggedInUserEmail === feedback.clientEmail && (
                                            <>
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
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="text-yellow-500">
                                        {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                                    </div>
                                    <p className="mt-1">{feedback.content}</p>
                                    {(feedback.reply || generateReply(feedback.rating, feedback.content)) && (
                                        <div className="bg-gray-50 border-l-4 border-blue-400 p-2 mt-2">
                                            <strong>Reply:</strong> {feedback.reply || generateReply(feedback.rating, feedback.content)}
                                        </div>
                                    )}
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