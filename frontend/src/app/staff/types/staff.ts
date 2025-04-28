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
    availabilityStartDate: string;  // Start date of availability range
    availabilityEndDate: string;    // End date of availability range
    assignedBookingId?: string; // Optional field to store the ID of the booking this staff is assigned to
    password: string; // Password for user account creation
}
