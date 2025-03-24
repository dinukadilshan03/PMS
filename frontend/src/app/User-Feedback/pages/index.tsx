import Link from "next/link";

export default function Home() {
    return (
        <div>
            <h1>Feedback System</h1>
            <Link href="/feedback">View Feedback</Link>
            <br />
            <Link href="/feedback/new">Submit Feedback</Link>
        </div>
    );
}
