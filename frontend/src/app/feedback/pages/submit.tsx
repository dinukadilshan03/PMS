"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/feedback/services/feedbackService";
import { useRouter } from "next/navigation";
import { Button } from "@/app/feedback/components/ui/Button";
import { Input } from "@/app/feedback/components/ui/input";
import { Textarea } from "@/app/feedback/components/ui/textarea";

export default function SubmitFeedback() {
    const router = useRouter();
    const [feedback, setFeedback] = useState({
        clientId: "",
        bookingId: "",
        message: "",
        rating: 1,
        category: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitFeedback(feedback);
            router.push("/feedback"); // Redirect after submission
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Submit Feedback</h1>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <Input name="clientId" placeholder="Client ID" value={feedback.clientId} onChange={handleChange} required />
                <Input name="bookingId" placeholder="Booking ID" value={feedback.bookingId} onChange={handleChange} required />
                <Textarea name="message" placeholder="Message" value={feedback.message} onChange={handleChange} required />
                <Input name="category" placeholder="Category (Photography, Service, etc.)" value={feedback.category} onChange={handleChange} required />
                <Input type="number" name="rating" min="1" max="5" value={feedback.rating} onChange={handleChange} required />
                <Button type="submit" className="bg-blue-500">Submit</Button>
            </form>
        </div>
    );
}
