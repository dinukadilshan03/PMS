import axios from "axios";

const API_URL = "http://localhost:8080/api/feedback";

// Submit feedback
export const submitFeedback = async (feedback: any) => {
    return axios.post(API_URL, feedback);
};

// Get all feedback
export const getAllFeedback = async () => {
    return axios.get(API_URL);
};

// Get feedback by category
export const getFeedbackByCategory = async (category: string) => {
    return axios.get(`${API_URL}/category/${category}`);
};

// Delete feedback (Admin only)
export const deleteFeedback = async (id: string) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Add a reply to feedback
export const addReply = async (feedbackId: string, reply: any) => {
    return axios.post(`${API_URL}/${feedbackId}/reply`, reply);
};
