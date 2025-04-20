// pages/bookings/create.tsx
import CreateBookingForm from '@/app/bookings/components/BookingForm';

const CreateBookingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:px-8 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Booking</h1>
                                <p className="mt-2 text-sm text-gray-600">Schedule your photography session</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    New Booking
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-8 sm:px-8">
                        <CreateBookingForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBookingPage;