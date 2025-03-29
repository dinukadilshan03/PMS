// types/portfolio.d.ts
export interface Portfolio {
    id: string;
    albumName: string;
    description: string;
    photographerName: string;
    category: string;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}