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
}
