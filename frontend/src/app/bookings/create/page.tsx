// pages/bookings/create.tsx
import CreateBookingForm from '@/app/bookings/components/BookingForm';

const CreateBookingPage = () => {
    return (
        <div className="min-h-screen bg-emerald-200 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <CreateBookingForm />
            </div>
        </div>
    );
};

export default CreateBookingPage;