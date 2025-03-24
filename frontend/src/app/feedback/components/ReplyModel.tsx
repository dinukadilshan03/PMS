"use client";

import { useState } from "react";
import { addReply } from "@/app/feedback/services/feedbackService";
import {Button} from "@/app/feedback/components/ui/Button";
import { Input } from "@/app/feedback/components/ui/input";

interface ReplyModalProps {
    feedbackId: string;
    onClose: () => void;
}

export default function ReplyModal({ feedbackId, onClose }: ReplyModalProps) {
    const [reply, setReply] = useState({ staffId: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReply({ ...reply, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await addReply(feedbackId, reply);
            onClose(); // Close modal after success
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-bold">Reply to Feedback</h2>
                <Input name="staffId" placeholder="Staff ID" onChange={handleChange} />
                <Input name="message" placeholder="Reply Message" onChange={handleChange} />
                <Button onClick={handleSubmit} className="mt-2 bg-green-500">Submit</Button>
                <Button onClick={onClose} className="mt-2 bg-gray-500">Cancel</Button>
            </div>
        </div>
    );
}
