

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-10 bg-white shadow-xl rounded-lg text-center">
                <h1 className="text-4xl font-bold text-blue-500">Tailwind CSS is Working! 🎉</h1>
                <p className="mt-4 text-gray-600">Customize and build your UI effortlessly!</p>
                <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                    Click Me
                </button>
            </div>
        </div>
    );
}
