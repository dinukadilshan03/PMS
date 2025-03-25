//Component for displaying feedback

import { Feedback } from "../types/feedback";
import FeedbackItem from "./FeedbackItem";

interface FeedbackListProps {
    feedbacks: Feedback[];
}

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
    return (
        <div>
            {feedbacks.map((feedback) => (
                <FeedbackItem key={feedback.id} feedback={feedback} />
            ))}
        </div>
    );
};

export default FeedbackList;
