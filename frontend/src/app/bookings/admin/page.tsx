// app/bookings/admin/page.tsx
import AdminBookingsList from '@/app/bookings/components/AdminBookingsList';

const AdminBookingsPage: React.FC = () => {
    return (
        <div>
            <h1>Admin Bookings</h1>
            <AdminBookingsList />
        </div>
    );
};

export default AdminBookingsPage;
