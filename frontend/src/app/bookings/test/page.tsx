import React from 'react';

const TailwindTestPage: React.FC = () => {
    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind CSS is working!</h1>
                <p className="text-xl text-gray-700">This is a simple test page to check if Tailwind CSS is working correctly in your project.</p>
                <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-700">Click Me</button>
            </div>
        </div>
    );
};

export default TailwindTestPage;
