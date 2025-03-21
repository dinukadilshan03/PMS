export interface Package {
  id: string;
  name: string;
  description: string;
  investment: number; // Package price in LKR
  packageType: string;
  servicesIncluded: string[];
  additionalItems: {
    editedImages: string;
    uneditedImages: string;
    albums: Array<{
      size: string;
      type: string;
      spreadCount: number;
    }>;
    framedPortraits: Array<{
      size: string;
      quantity: number;
    }>;
    thankYouCards: number;
  };
}
