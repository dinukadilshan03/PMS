// utils/api.ts
import axios from 'axios';

export const createBooking = async (data: never) => {
    try {
        const response = await axios.post('http://localhost:8080/api/bookings', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create booking');
        console.error(error);
    }
};

export const fetchBookings = async (filters: never) => {
    try {
        const response = await axios.get('http://localhost:8080/api/admin/bookings', { params: filters });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch bookings');
        console.error(error);
    }
};
