"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError('Invalid email or password');
                return;
            }

            const data = await res.json();  // Parse the JSON response
            console.log('Login successful:', data);  // Log the response to inspect it

            // Assuming the response contains 'userId' and 'role'
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);

            router.push('/bookings'); // Navigate to /bookings after login

        } catch (err) {
            setError('Something went wrong');
            console.log(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 px-4 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 px-4 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Login
            </button>
        </div>
    );
}
