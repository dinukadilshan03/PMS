//Page to view all feedback

import { GetServerSideProps } from "next";
import FeedbackList from "../components/FeedbackList";
import { Feedback } from "../types/feedback";

interface FeedbackPageProps {
    feedbacks: Feedback[];
}

const FeedbackPage = ({ feedbacks }: FeedbackPageProps) => {
    return (
        <div>
            <h1>All Feedback</h1>
            <FeedbackList feedbacks={feedbacks} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`);
    const feedbacks: Feedback[] = await res.json();

    return {
        props: { feedbacks },
    };
};

export default FeedbackPage;
