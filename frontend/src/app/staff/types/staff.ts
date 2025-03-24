export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    experience: string;
    hourlyRate: number;
    specialization: string;
    availability: boolean;  // true for Available, false for Busy
}
