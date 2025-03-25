// pages/bookings/create.tsx
import CreateBookingForm from '@/app/bookings/components/BookingForm';

const CreateBookingPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center mt-8">Create a Booking</h1>
            <CreateBookingForm />
        </div>
    );
};

export default CreateBookingPage;
