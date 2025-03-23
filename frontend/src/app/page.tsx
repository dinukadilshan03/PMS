import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Link href={"/try"}>
                Try Page
            </Link>
        </div>
    );
}