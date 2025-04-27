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
    const [packages, setPackages] = useState<{id: string, name: string, investment: number, packageType: string, servicesIncluded: string[], additionalItems: any}[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch packages from backend
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:8080/api/packages");
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setErrors(prev => ({
                    ...prev,
                    form: "Failed to load packages. Please refresh the page."
                }));
            } finally {
                setIsLoading(false);
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

        // Retrieve userId from sessionStorage
        const userId = sessionStorage.getItem("userId");
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
                    "Userid": userId,
                },
                body: JSON.stringify({
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    location: formData.location,
                    packageName: formData.selectedPackage,
                    dateTime: new Date(formData.dateTime).toISOString(),
                    clientId: userId,
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

    const PackageDetails = ({ selectedPackage }: { selectedPackage: any }) => {
        if (!selectedPackage) return null;
        
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-gray-900">{selectedPackage.investment} LKR</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{selectedPackage.packageType}</span>
                </div>
                
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Services Included:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {selectedPackage.servicesIncluded.map((service: string, index: number) => (
                            <li key={index} className="text-gray-600">{service}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Items:</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Edited Images:</span>
                            <span className="font-medium text-gray-900">{selectedPackage.additionalItems.editedImages}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Unedited Images:</span>
                            <span className="font-medium text-gray-900">{selectedPackage.additionalItems.uneditedImages}</span>
                        </div>
                        
                        {selectedPackage.additionalItems.albums && selectedPackage.additionalItems.albums.length > 0 && (
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Albums:</h5>
                                <ul className="list-disc pl-5 space-y-1">
                                    {selectedPackage.additionalItems.albums.map((album: any, index: number) => (
                                        <li key={index} className="text-gray-600">
                                            {album.size} {album.type} (Spread Count: {album.spreadCount})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedPackage.additionalItems.framedPortraits && selectedPackage.additionalItems.framedPortraits.length > 0 && (
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Framed Portraits:</h5>
                                <ul className="list-disc pl-5 space-y-1">
                                    {selectedPackage.additionalItems.framedPortraits.map((portrait: any, index: number) => (
                                        <li key={index} className="text-gray-600">
                                            {portrait.size} (Quantity: {portrait.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedPackage.additionalItems.thankYouCards && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thank You Cards:</span>
                                <span className="font-medium text-gray-900">{selectedPackage.additionalItems.thankYouCards}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    {(errors.form || Object.values(errors).some(error => error)) && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Form Errors</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        {errors.form && <p className="font-medium">{errors.form}</p>}
                                        <ul className="list-disc pl-5 space-y-1 mt-1">
                                            {errors.email && <li>{errors.email}</li>}
                                            {errors.phoneNumber && <li>{errors.phoneNumber}</li>}
                                            {errors.location && <li>{errors.location}</li>}
                                            {errors.selectedPackage && <li>{errors.selectedPackage}</li>}
                                            {errors.dateTime && <li>{errors.dateTime}</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.phoneNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        placeholder="123-456-7890"
                                        required
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                                {errors.location && (
                                    <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="selectedPackage" className="block text-sm font-medium text-gray-700">Package</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <select
                                        id="selectedPackage"
                                        value={formData.selectedPackage}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-2 border ${errors.selectedPackage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        required
                                    >
                                        <option value="">Select a package</option>
                                        {packages.map((pkg) => (
                                            <option key={pkg.id} value={pkg.name}>
                                                {pkg.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.selectedPackage && (
                                    <p className="mt-2 text-sm text-red-600">{errors.selectedPackage}</p>
                                )}
                            </div>

                            {formData.selectedPackage && (
                                <div className="sm:col-span-2">
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Details</h3>
                                        <PackageDetails selectedPackage={packages.find(pkg => pkg.name === formData.selectedPackage)} />
                                    </div>
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Date & Time</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="datetime-local"
                                        id="dateTime"
                                        value={formData.dateTime}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.dateTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                                {errors.dateTime && (
                                    <p className="mt-2 text-sm text-red-600">{errors.dateTime}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.push('/bookings')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                        loading || !isFormValid
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            </div>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default CreateBookingForm;