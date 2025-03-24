import axios from "axios";

const API_URL = "http://localhost:8080/api/feedback";

export const fetchFeedbacks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const submitFeedback = async (feedback: {
    clientId: string;
    bookingId: string;
    message: string;
    rating: number;
    category: string;
}) => {
    const response = await axios.post(API_URL, feedback);
    return response.data;
};

export const deleteFeedback = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const addReply = async (feedbackId: string, reply: { staffId: string; message: string }) => {
    const response = await axios.post(`${API_URL}/${feedbackId}/reply`, reply);
    return response.data;
};
