//TypeScript types for feedback and reply

export interface Reply {
    staffId: string;
    message: string;
    localDate: string;
}

export interface Feedback {
    id: string;
    clientId: string;
    bookingId: string;
    message: string;
    rating: number;
    category: string;
    LocalDateTime: string;
    replies: Reply[];
}
