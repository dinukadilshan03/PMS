import { useEffect, useState } from "react";
import { fetchFeedbacks, deleteFeedback } from "@/services/feedbackService";
import ReplyForm from "@/components/ReplyForm";

interface Reply {
    staffId: string;
    message: string;
}

interface Feedback {
    id: string;
    clientId: string;
    bookingId: string;
    message: string;
    rating: number;
    category: string;
    replies: Reply[];
}

export default function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        const data = await fetchFeedbacks();
        setFeedbacks(data);
    };

    const handleDelete = async (id: string) => {
        await deleteFeedback(id);
        loadFeedbacks();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Feedback List</h1>
            {feedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 border rounded mb-4">
                    <p><strong>Message:</strong> {feedback.message}</p>
                    <p><strong>Category:</strong> {feedback.category}</p>
                    <p><strong>Rating:</strong> {feedback.rating} ⭐</p>

                    {/* Display Replies */}
                    <h3 className="font-bold mt-2">Replies:</h3>
                    {feedback.replies.length > 0 ? (
                        feedback.replies.map((reply, index) => (
                            <p key={index} className="text-sm text-gray-700">
                                {reply.message} - <span className="text-gray-500">Staff ID: {reply.staffId}</span>
                            </p>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No replies yet.</p>
                    )}

                    {/* Reply Form */}
                    <ReplyForm feedbackId={feedback.id} onReplyAdded={loadFeedbacks} />

                    {/* Delete Button */}
                    <button onClick={() => handleDelete(feedback.id)} className="text-red-500 mt-2">Delete</button>
                </div>
            ))}
        </div>
    );
}
