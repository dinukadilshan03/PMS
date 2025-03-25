import AlbumList from '@/app/Album-Portfolio/components/AlbumList';
import AlbumForm from '@/app/Album-Portfolio/components/AlbumForm';

export default function AlbumsPage() {
    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Album Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AlbumForm />
            </div>
        </div>
    );
}
