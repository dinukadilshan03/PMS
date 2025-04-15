// app/Album-Portfolio/album/pages/[id]/page.tsx
import EditAlbumForm from "@/app/Album-Portfolio/album/components/EditAlbumForm";

export default function AlbumDetailPage({
                                            params,
                                        }: {
    params: { id: string };
}) {

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Album Details</h1>
            <EditAlbumForm />

            {/* Optionally add navigation back to album list */}
            <div className="mt-8">
                <a
                    href="/Album-Portfolio/album/pages"
                    className="text-blue-500 hover:underline"
                >
                    &larr; Back to Albums
                </a>
            </div>
        </div>
    );
}