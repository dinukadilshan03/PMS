// types/staff.ts
export interface Staff {
    id: string;  // Ensure id exists in staff model
    name: string;
    email: string;
    phone: string;
    experience: string;
    hourlyRate: number;
    specialization: string;
    availability: boolean;
}
