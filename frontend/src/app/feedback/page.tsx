// app/bookings/feedback/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditFeedbackDialog from './components/EditFeedbackDialog';

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
        clientId: '',
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
    const router = useRouter();
    const [editingFeedback, setEditingFeedback] = useState<{
        id: string;
        content: string;
        rating: number;
        packageName: string;
        clientEmail: string;
    } | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Initialize user data from session storage
    useEffect(() => {
        const initializeUserData = () => {
            const userEmail = sessionStorage.getItem('email');
            console.log('Initializing user email:', userEmail);
            setLoggedInUserEmail(userEmail);
        };
        initializeUserData();
    }, []);

    // Add effect to monitor loggedInUserEmail changes
    useEffect(() => {
        console.log('loggedInUserEmail changed:', loggedInUserEmail);
    }, [loggedInUserEmail]);

    // Validate form fields
    const validateForm = () => {
        const errors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.clientName.trim()) {
            errors.clientName = 'Client name is required';
        } else if (/\d/.test(formData.clientName)) {
            errors.clientName = 'Name cannot contain numbers';
        }

        if (!formData.clientEmail) {
            errors.clientEmail = 'Email is required';
        } else if (!emailRegex.test(formData.clientEmail)) {
            errors.clientEmail = 'Invalid email format';
        }

        if (!formData.content) {
            errors.content = 'Feedback content is required';
        } else if (formData.content.length > 500) {
            errors.content = 'Content cannot exceed 500 characters';
        }

        if (!formData.packageName) {
            errors.packageName = 'Package selection is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Fetch packages from backend
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/packages`);
                if (!response.ok) throw new Error('Failed to fetch packages');
                const data = await response.json();
                setPackages(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch packages');
            }
        };
        fetchPackages();
    }, []);

    // Fetch feedbacks based on selected package filter
    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const url = selectedPackage
                ? `${API_BASE_URL}/api/feedbacks/active?packageName=${selectedPackage}`
                : `${API_BASE_URL}/api/feedbacks/active`;

            console.log('Fetching feedbacks from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch feedbacks: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Received feedbacks:', data);
            setFeedbacks(data);
        } catch (err) {
            console.error('Error in fetchFeedbacks:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Refresh feedbacks when package filter changes
    useEffect(() => {
        fetchFeedbacks();
    }, [selectedPackage]);

    // Check if user has bookings before allowing feedback creation
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

    // Handle navigation to create feedback page after validation
    const handleAddFeedback = async () => {
        const hasBookings = await checkUserBookings();
        if (hasBookings) {
            router.push('/feedback/create');
        } else {
            setError('You must book a session before you can leave feedback. Please make a booking first.');
        }
    };

    // Handle form input changes with validation
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

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle package filter changes
    const handlePackageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPackage(e.target.value);
    };

    // Handle feedback edit action
    const handleEdit = (feedback: Feedback) => {
        setEditingFeedback({
            id: feedback.id,
            content: feedback.content,
            rating: feedback.rating,
            packageName: feedback.packageName,
            clientEmail: feedback.clientEmail
        });
    };

    // Validate and save edited feedback
    const handleSaveEdit = async (id: string, content: string, rating: number, packageName: string) => {
        setLoading(true);
        try {
            const userEmail = sessionStorage.getItem('email');
            if (!userEmail) {
                throw new Error('User not logged in');
            }

            const response = await fetch(`${API_BASE_URL}/api/feedbacks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    content, 
                    rating, 
                    packageName,
                    clientEmail: userEmail
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update feedback');
            }

            // Update the feedbacks state directly
            setFeedbacks(prevFeedbacks => 
                prevFeedbacks.map(feedback => 
                    feedback.id === id 
                        ? {
                            ...feedback,
                            content,
                            rating,
                            packageName,
                            updatedAt: new Date().toISOString(),
                            clientEmail: userEmail
                          }
                        : feedback
                )
            );

            // Ensure the logged in user email is set
            setLoggedInUserEmail(userEmail);
            setValidationErrors({});
        } catch (error) {
            console.error('Error updating feedback:', error);
            setError('Failed to update feedback');
        } finally {
            setLoading(false);
            setEditingFeedback(null);
        }
    };

    // Handle feedback deletion
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/feedbacks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete feedback');

            await fetchFeedbacks();
            // Re-fetch user email from session storage
            const currentEmail = sessionStorage.getItem('email');
            console.log('Current email after delete:', currentEmail);
            setLoggedInUserEmail(currentEmail);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        } finally {
            setLoading(false);
        }
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
                                    {feedback.clientEmail === sessionStorage.getItem('email') && (
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
                                    )}
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

            {/* Edit Feedback Dialog */}
            {editingFeedback && (
                <EditFeedbackDialog
                    isOpen={!!editingFeedback}
                    onClose={() => setEditingFeedback(null)}
                    feedback={editingFeedback}
                    onSave={handleSaveEdit}
                    packages={packages}
                    validationErrors={validationErrors}
                />
            )}
        </div>
    );
}