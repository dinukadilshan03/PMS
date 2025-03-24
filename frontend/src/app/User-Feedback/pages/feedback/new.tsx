import { useState } from "react";
import { submitFeedback } from "@/services/feedbackService";
import { useRouter } from "next/router";

export default function NewFeedback() {
    const [form, setForm] = useState({ clientId: "", bookingId: "", message: "", rating: 1, category: "" });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitFeedback(form);
        router.push("/feedback");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Submit Feedback</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="clientId" placeholder="Client ID" onChange={handleChange} className="border p-2 w-full" required />
                <input type="text" name="bookingId" placeholder="Booking ID" onChange={handleChange} className="border p-2 w-full" required />
                <textarea name="message" placeholder="Your feedback" onChange={handleChange} className="border p-2 w-full" required />
                <input type="number" name="rating" placeholder="Rating (1-5)" min="1" max="5" onChange={handleChange} className="border p-2 w-full" required />
                <select name="category" onChange={handleChange} className="border p-2 w-full">
                    <option value="">Select Category</option>
                    <option value="Photography">Photography</option>
                    <option value="Service">Service</option>
                    <option value="Price">Price</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
        </div>
    );
}
