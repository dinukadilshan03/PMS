//Handle API requests

import { NextApiRequest, NextApiResponse } from "next";
import { Feedback } from "../../types/feedback";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const response = await fetch(`${API_URL}/api/feedback`);
        const feedbacks: Feedback[] = await response.json();
        res.status(200).json(feedbacks);
    } else if (req.method === "POST") {
        const newFeedback = req.body;
        const response = await fetch(`${API_URL}/api/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFeedback),
        });
        const data = await response.json();
        res.status(201).json(data);
    }
}
