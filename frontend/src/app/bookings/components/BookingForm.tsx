"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const CreateBookingForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        location: "",
        selectedPackage: "",
        dateTime: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        phoneNumber: "",
        location: "",
        selectedPackage: "",
        dateTime: "",
        form: ""
    });
    const [packages, setPackages] = useState<{id: string, name: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Fetch packages from backend
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setErrors(prev => ({
                    ...prev,
                    form: "Failed to load packages. Please refresh the page."
                }));
            }
        };
        fetchPackages();
    }, []);

    // Set the selected package when page loads or packages change
    useEffect(() => {
        const packageName = searchParams?.get("packageName");
        if (packageName && packages.length > 0) {
            const exists = packages.some(pkg => pkg.name === packageName);
            if (exists) {
                setFormData(prev => ({ ...prev, selectedPackage: packageName }));
            } else {
                console.warn(`Package "${packageName}" not found`);
            }
        }
    }, [searchParams, packages]);

    // Validate form on change
    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {
            email: "",
            phoneNumber: "",
            location: "",
            selectedPackage: "",
            dateTime: "",
            form: ""
        };

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone number validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number";
        }

        // Location validation
        if (!formData.location) {
            newErrors.location = "Location is required";
        } else if (formData.location.length < 5) {
            newErrors.location = "Location must be at least 5 characters";
        }

        // Package validation
        if (!formData.selectedPackage) {
            newErrors.selectedPackage = "Please select a package";
        }

        // Date & Time validation
        if (!formData.dateTime) {
            newErrors.dateTime = "Date and time are required";
        } else {
            const selectedDate = new Date(formData.dateTime);
            const currentDate = new Date();
            if (selectedDate < currentDate) {
                newErrors.dateTime = "Cannot book in the past";
            }
        }

        setErrors(newErrors);
        setIsFormValid(
            !newErrors.email &&
            !newErrors.phoneNumber &&
            !newErrors.location &&
            !newErrors.selectedPackage &&
            !newErrors.dateTime &&
            !!formData.email &&
            !!formData.phoneNumber &&
            !!formData.location &&
            !!formData.selectedPackage &&
            !!formData.dateTime
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            setErrors(prev => ({
                ...prev,
                form: "Please fix all errors before submitting"
            }));
            return;
        }

        // Retrieve userId from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setErrors(prev => ({
                ...prev,
                form: "You must be logged in to make a booking"
            }));
            return;
        }

        setLoading(true);
        setErrors(prev => ({ ...prev, form: "" }));

        try {
            const response = await fetch("http://localhost:8080/api/bookings/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    userId: userId,
                },
                body: JSON.stringify({
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    location: formData.location,
                    packageName: formData.selectedPackage,
                    dateTime: formData.dateTime,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Booking limit reached for this day");
            }

            // Redirect to bookings page with success message
            router.push("/bookings?success=true");

        } catch (err) {
            const errorMessage = err instanceof Error
                ? `Error creating booking: ${err.message}`
                : "Error creating booking: An unknown error occurred";
            setErrors(prev => ({
                ...prev,
                form: errorMessage
            }));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-2xl p-8 border-2 border-gray-300 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create a New Booking</h2>

                {(errors.form || Object.values(errors).some(error => error)) && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        {errors.form && <p className="font-bold mb-2">{errors.form}</p>}
                        <ul className="list-disc pl-5 space-y-1">
                            {errors.email && <li>{errors.email}</li>}
                            {errors.phoneNumber && <li>{errors.phoneNumber}</li>}
                            {errors.location && <li>{errors.location}</li>}
                            {errors.selectedPackage && <li>{errors.selectedPackage}</li>}
                            {errors.dateTime && <li>{errors.dateTime}</li>}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1 p-3 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`mt-1 p-3 w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                            required
                            placeholder="e.g., 123-456-7890"
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`mt-1 p-3 w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                            required
                        />
                        {errors.location && (
                            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="selectedPackage" className="block text-lg font-medium text-gray-700 mb-1">Package</label>
                        <select
                            id="selectedPackage"
                            value={formData.selectedPackage}
                            onChange={handleChange}
                            className={`mt-1 p-3 w-full border ${errors.selectedPackage ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                            required
                        >
                            <option value="">Select a package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.name}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                        {errors.selectedPackage && (
                            <p className="mt-1 text-sm text-red-600">{errors.selectedPackage}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="dateTime" className="block text-lg font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="dateTime"
                            value={formData.dateTime}
                            onChange={handleChange}
                            className={`mt-1 p-3 w-full border ${errors.dateTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-indigo-500`}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {errors.dateTime && (
                            <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={`bg-amber-700 text-white px-4 py-3 rounded-md w-full text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        ${loading ? 'opacity-70 cursor-not-allowed' : !isFormValid ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            "Create Booking"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingForm;