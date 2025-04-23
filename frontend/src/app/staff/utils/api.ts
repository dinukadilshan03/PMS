import axios from "axios";

// Set the base URL for the backend API
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Change the base URL as necessary
    headers: {
        "Content-Type": "application/json",
    },
});

// fetch all staff
export const getAllStaff = async () => {
    try {
        const response = await api.get("/staff");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch staff.");
    }
};

// Update staff availability
export const updateStaffAvailability = async (id: string, availability: boolean) => {
    try {
        const response = await api.put(`/staff/availability/${id}`, {
            availability,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to update availability.");
    }
};

// Delete a staff member
export const deleteStaff = async (id: string) => {
    try {
        const response = await api.delete(`/staff/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete staff.");
    }
};

// Get staff details by ID
export const getStaffById = async (id: string) => {
    try {
        const response = await api.get(`/staff/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch staff details.");
    }
};

// Add new staff member
export const addStaff = async (staffData: any) => {
    try {
        const response = await api.post("/staff", staffData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to add staff.");
    }
};

//Update staff details
export const updateStaff = async (id: string, updatedData: any) => {
    try {
        const response = await api.put(`/staff/${id}`, updatedData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update staff.");
    }
};
