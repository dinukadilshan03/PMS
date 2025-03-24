"use client";

import { useEffect, useState } from "react";
import { getAllFeedback, deleteFeedback } from "@/app/feedback/services/feedbackService";
import { Button } from "@/app/feedback/components/ui/Button";

interface Feedback {
    id: string;
    clientId: string;
    bookingId: string;
    message: string;
    rating: number;
    category: string;
    timestamp: string;
    replies: { staffId: string; message: string; timestamp: string }[];
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await getAllFeedback();
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteFeedback(id);
            fetchFeedbacks(); // Refresh list after delete
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Feedback List</h1>
            <div className="mt-4 space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border p-4 rounded-lg shadow">
                        <p><strong>Message:</strong> {feedback.message}</p>
                        <p><strong>Category:</strong> {feedback.category}</p>
                        <p><strong>Rating:</strong> ⭐{feedback.rating}</p>
                        <p><strong>Replies:</strong> {feedback.replies.length}</p>
                        <Button
                            className="mt-2 bg-red-500"
                            onClick={() => handleDelete(feedback.id)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
