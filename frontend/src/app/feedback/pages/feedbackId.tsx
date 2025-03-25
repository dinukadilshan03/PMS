//Page to view detailed feedback

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import FeedbackItem from "../../feedback/components/FeedbackItem";
import { Feedback } from "../../feedback/types/feedback";

interface FeedbackDetailPageProps {
    feedback: Feedback;
}

const FeedbackDetailPage = ({ feedback }: FeedbackDetailPageProps) => {
    return (
        <div>
            <h1>Feedback Details</h1>
            <FeedbackItem feedback={feedback} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`);
    const feedback: Feedback = await res.json();

    return {
        props: { feedback },
    };
};

export default FeedbackDetailPage;
