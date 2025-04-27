"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    Typography
} from '@mui/material';
import PackageDetails from "./PackageDetails";

const SRI_LANKAN_CITIES = [
    { name: "Colombo", multiplier: 1.0 },
    { name: "Gampaha", multiplier: 1.1 },
    { name: "Kalutara", multiplier: 1.2 },
    { name: "Kandy", multiplier: 1.3 },
    { name: "Galle", multiplier: 1.4 },
    { name: "Matara", multiplier: 1.5 },
    { name: "Negombo", multiplier: 1.1 },
    { name: "Anuradhapura", multiplier: 1.6 },
    { name: "Jaffna", multiplier: 1.8 },
    { name: "Trincomalee", multiplier: 1.7 },
    { name: "Batticaloa", multiplier: 1.7 },
    { name: "Ratnapura", multiplier: 1.4 },
    { name: "Badulla", multiplier: 1.5 },
    { name: "Kurunegala", multiplier: 1.3 },
    { name: "Puttalam", multiplier: 1.4 }
];

interface Package {
    id: string;
    name: string;
    investment: number;
    packageType: string;
    servicesIncluded: string[];
    additionalItems: {
        editedImages: number;
        uneditedImages: number;
        albums?: Array<{
            size: string;
            type: string;
            spreadCount: number;
        }>;
        framedPortraits?: Array<{
            size: string;
            quantity: number;
        }>;
        thankYouCards?: number;
    };
}

interface FormData {
    email: string;
    phoneNumber: string;
    location: string;
    selectedPackage: string;
    dateTime: string;
    calculatedPrice: number;
}

interface FormErrors {
    email: string;
    phoneNumber: string;
    location: string;
    selectedPackage: string;
    dateTime: string;
    form: string;
}

const CreateBookingForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: "",
        phoneNumber: "",
        location: "",
        selectedPackage: "",
        dateTime: "",
        calculatedPrice: 0
    });
    const [errors, setErrors] = useState<FormErrors>({
        email: "",
        phoneNumber: "",
        location: "",
        selectedPackage: "",
        dateTime: "",
        form: ""
    });
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [limitDialog, setLimitDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
    }>({
        open: false,
        title: '',
        message: ''
    });

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
        const newErrors: FormErrors = {
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

    const calculateTotalPrice = (packagePrice: number, location: string) => {
        if (!location) return packagePrice;
        const city = SRI_LANKAN_CITIES.find(city => city.name === location);
        if (!city) return packagePrice;
        return Math.round(packagePrice * city.multiplier);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [id]: value
            };
            
            // Calculate new price if package or location changes
            if (id === 'selectedPackage' || id === 'location') {
                const selectedPackage = packages.find(pkg => pkg.name === (id === 'selectedPackage' ? value : prev.selectedPackage));
                if (selectedPackage) {
                    newData.calculatedPrice = calculateTotalPrice(
                        selectedPackage.investment,
                        id === 'location' ? value : prev.location
                    );
                }
            }
            
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            setLimitDialog({
                open: true,
                title: 'Form Validation Error',
                message: 'Please fix all errors before submitting'
            });
            return;
        }

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            setLimitDialog({
                open: true,
                title: 'Authentication Error',
                message: 'You must be logged in to make a booking'
            });
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
                    price: formData.calculatedPrice
                }),
            });

            if (!response.ok) {
                let errorMessage = 'An error occurred while creating the booking';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData;
                    } else {
                        errorMessage = await response.text();
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                setLimitDialog({
                    open: true,
                    title: 'Booking Error',
                    message: errorMessage
                });
                return;
            }

            router.push("/bookings?success=true");

        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "An unknown error occurred";
            setLimitDialog({
                open: true,
                title: 'Error',
                message: `Error creating booking: ${errorMessage}`
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    <Dialog
                        open={limitDialog.open}
                        onClose={() => setLimitDialog(prev => ({ ...prev, open: false }))}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                maxWidth: '320px',
                                width: '100%',
                                mx: 2
                            }
                        }}
                    >
                        <DialogTitle sx={{ 
                            fontWeight: 600,
                            color: 'error.main',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            py: 2
                        }}>
                            {limitDialog.title}
                        </DialogTitle>
                        <DialogContent sx={{ 
                            py: 2,
                            px: 3,
                            textAlign: 'center'
                        }}>
                            <Typography variant="body1" sx={{ 
                                color: 'text.secondary',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontSize: '0.95rem',
                                lineHeight: 1.5
                            }}>
                                {limitDialog.message}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ 
                            px: 3,
                            py: 2,
                            justifyContent: 'center'
                        }}>
                            <Button 
                                onClick={() => setLimitDialog(prev => ({ ...prev, open: false }))}
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    borderColor: 'error.main',
                                    color: 'error.main',
                                    '&:hover': {
                                        backgroundColor: 'error.light',
                                        borderColor: 'error.main'
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

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
                                    <select
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-2 border ${errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md sm:text-sm`}
                                        required
                                    >
                                        <option value="">Select a location</option>
                                        {SRI_LANKAN_CITIES.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
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
                                        <PackageDetails selectedPackage={packages.find(pkg => pkg.name === formData.selectedPackage) || null} />
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

                        {formData.calculatedPrice > 0 && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-green-800 font-medium">Total Price:</span>
                                    <span className="text-green-900 font-bold text-xl">{formData.calculatedPrice} LKR</span>
                                </div>
                                {formData.location && formData.selectedPackage && (
                                    <p className="mt-2 text-sm text-green-700">
                                        Price includes location adjustment for {formData.location}
                                    </p>
                                )}
                            </div>
                        )}

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