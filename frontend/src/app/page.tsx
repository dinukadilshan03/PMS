import AlbumList from '@/app/Album-Portfolio/components/AlbumList';
import AlbumForm from '@/app/Album-Portfolio/components/AlbumForm';



export default function Home() {

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Album Management</h1>
                    <p className="text-lg text-gray-600">Create and manage your photo albums</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md mb-8">
                        <AlbumForm />
                    </div>
                </div>
            </div>
        </div>
    );
}