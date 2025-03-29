// app/page.tsx
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">Beni Moments</h1>
                    <div className="flex space-x-4">
                        <Link href="/Album-Portfolio/albums/" className="text-gray-600 hover:text-blue-500 transition-colors">
                            Albums
                        </Link>
                        <Link href="/Album-Portfolio/portfolio/" className="text-gray-600 hover:text-blue-500 transition-colors">
                            Portfolio
                        </Link>
                        <Link href="/#" className="text-gray-600 hover:text-blue-500 transition-colors">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Beni Moments</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Manage and showcase your photo collections with ease
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/Album-Portfolio/albums/"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Browse Albums
                    </Link>
                    <Link
                        href="/Album-Portfolio/portfolio/"
                        className="bg-white text-blue-500 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        View Portfolio
                    </Link>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16">

            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} PhotoGallery. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}