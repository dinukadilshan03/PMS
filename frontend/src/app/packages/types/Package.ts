interface Package {
  id: string;
  name: string;
  investment: number;
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
  image: string;  // This will store the URL for each package's image
}
