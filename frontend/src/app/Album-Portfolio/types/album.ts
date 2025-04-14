// Define the Album interface
// types/album.ts

export interface Album {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    images: string[];
    category: string;
    location: string;
    status: string;
    releaseDate: Date;
}