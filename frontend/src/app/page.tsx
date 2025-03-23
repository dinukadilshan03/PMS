import Link from "next/link";

export default function Home() {
    return (
        <div>
            <Link href="/Album-Portfolio/albumShow/">
                Show Albums
            </Link>
            <br/>
            <Link href="/Album-Portfolio/uploadAlbum/">
                Upload New Album
            </Link>
        </div>
    );
}