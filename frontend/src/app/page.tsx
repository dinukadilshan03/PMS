import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-10 bg-white shadow-xl rounded-lg text-center">
                <h1 className="text-4xl font-bold text-blue-500">admin dashbord</h1>

                {/* Link to the Add Form */}
                <div className="flex space-x-4">
                    <Link href="/staff/add" passHref>
                        <button className="mt-6 px-1 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                            Go to Add Form
                        </button>
                    </Link>

                    <Link href="/staff/stafflist" passHref>
                        <button className="mt-6 px-1 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                            Go to Staff List
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
