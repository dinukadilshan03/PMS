export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    experience: string;
    hourlyRate: number;
    specialization: string;
    availability: boolean;
    availabilityDate: string;// This should match the backend field
    assignedBookingId?: string; // Optional field to store the ID of the booking this staff is assigned to
}
