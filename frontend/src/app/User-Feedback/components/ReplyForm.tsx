import { useState } from "react";
import { addReply } from "@/services/feedbackService";

interface ReplyFormProps {
    feedbackId: string;
    onReplyAdded: () => void;
}

export default function ReplyForm({ feedbackId, onReplyAdded }: ReplyFormProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addReply(feedbackId, { staffId: "123", message }); // Replace with actual staffId
        onReplyAdded();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea onChange={(e) => setMessage(e.target.value)} placeholder="Write a reply..." className="border p-2 w-full" required />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Reply</button>
        </form>
    );
}
