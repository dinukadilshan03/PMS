//Component for submitting new feedback

import { useState } from "react";
import { Feedback } from "../types/feedback";

const FeedbackForm = () => {
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(1);
    const [category, setCategory] = useState("Service");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newFeedback: Feedback = {
            message,
            rating,
            category,
        };

        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFeedback),
        });

        if (res.ok) {
            alert("Feedback submitted successfully!");
        } else {
            alert("Failed to submit feedback.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your feedback"
          required
      />
            <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
            >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
            </select>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="Service">Service</option>
                <option value="Photography">Photography</option>
                <option value="Price">Price</option>
            </select>
            <button type="submit">Submit Feedback</button>
        </form>
    );
};

export default FeedbackForm;
