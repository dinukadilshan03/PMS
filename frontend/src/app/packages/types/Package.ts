export interface Package {
  description: string;

  id: string;
  name: string;
  investment: number;
  packageType: string;
  servicesIncluded: string[];
  additionalItems: AdditionalItems;
  image: string;
}

export interface AdditionalItems {
  editedImages: string;
  uneditedImages: string;
  albums: Album[]; // Array of Album objects
  framedPortraits: FramedPortrait[]; // Array of FramedPortrait objects
  thankYouCards: number;
}

export interface Album {
  size: string;
  type: string;
  spreadCount: number;
}

export interface FramedPortrait {
  size: string;
  quantity: number;
}
