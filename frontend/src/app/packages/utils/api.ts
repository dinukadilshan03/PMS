// app/utils/page.tsx
import { Package } from '../types/Package';

// Function to fetch all packages from the backend
export const getPackages = async (): Promise<Package[]> => {
    const response = await fetch('http://localhost:8080/api/packages');
    if (!response.ok) {
        throw new Error('Failed to fetch packages');
    }
    return await response.json(); // Returns an array of packages
};

// Function to delete a package by its ID
export const deletePackage = async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/packages/${id}`, {
        method: 'DELETE', // Specify that it's a DELETE request
    });
    if (!response.ok) {
        throw new Error('Failed to delete package');
    }
};

// Function to create a new package (POST request)
export const createPackage = async (packageData: Package): Promise<Package> => {
    const response = await fetch('http://localhost:8080/api/packages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
    });
    if (!response.ok) {
        throw new Error('Failed to create package');
    }
    return await response.json(); // Returns the created package
};

// Function to update an existing package (PUT request)
export const updatePackage = async (id: string, packageData: Package): Promise<Package> => {
    const response = await fetch(`http://localhost:8080/api/packages/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
    });
    if (!response.ok) {
        throw new Error('Failed to update package');
    }
    return await response.json(); // Returns the updated package
};
