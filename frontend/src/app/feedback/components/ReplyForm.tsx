//Component for submitting a reply to feedback

import { useState } from "react";

interface ReplyFormProps {
    feedbackId: string;
}

const ReplyForm = ({ feedbackId }: ReplyFormProps) => {
    const [message, setMessage] = useState("");
    const [staffId, setStaffId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const reply = { message, staffId };
        const res = await fetch(`/api/feedback/${feedbackId}/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reply),
        });

        if (res.ok) {
            alert("Reply submitted successfully!");
        } else {
            alert("Failed to submit reply.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Your Staff ID"
                required
            />
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your reply"
                required
            />
            <button type="submit">Submit Reply</button>
        </form>
    );
};

export default ReplyForm;
