"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        contactNumber: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/auth/profile/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = sessionStorage.getItem('userId');
        if (!userId) return;

        try {
            const res = await fetch(`http://localhost:8080/api/auth/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Update failed');
            // Redirect immediately (no delay)
            router.push('UserProfile/profile');

            // setSuccess('Profile updated successfully!');
            // setTimeout(() => router.push('/profile'), 1500); // Redirect back after success
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            {error && <p className="text-red-500">{error}</p>}
            {/*{success && <p className="text-green-500">{success}</p>}*/}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={user.contactNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
}