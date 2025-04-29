// types/booking.ts
export interface Booking {
    id: string;
    dateTime: string;
    clientId: string;
    bookingStatus: 'upcoming' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    phoneNumber: string;
    email: string;
    location: string;
    packageName: string;
    price: number;
    assignedStaffId?: string;
    assignedStaffName?: string;
}
