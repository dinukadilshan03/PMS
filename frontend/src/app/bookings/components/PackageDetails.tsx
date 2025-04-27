import React from 'react';

interface Album {
    size: string;
    type: string;
    spreadCount: number;
}

interface FramedPortrait {
    size: string;
    quantity: number;
}

interface AdditionalItems {
    editedImages: number;
    uneditedImages: number;
    albums?: Album[];
    framedPortraits?: FramedPortrait[];
    thankYouCards?: number;
}

interface Package {
    investment: number;
    packageType: string;
    servicesIncluded: string[];
    additionalItems: AdditionalItems;
}

interface PackageDetailsProps {
    selectedPackage: Package | null;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ selectedPackage }) => {
    if (!selectedPackage) return null;
    
    const { albums = [], framedPortraits = [] } = selectedPackage.additionalItems;
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-gray-900">{selectedPackage.investment} LKR</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{selectedPackage.packageType}</span>
            </div>
            
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Services Included:</h4>
                <ul className="list-disc pl-5 space-y-1">
                    {selectedPackage.servicesIncluded.map((service, index) => (
                        <li key={index} className="text-gray-600">{service}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Items:</h4>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Edited Images:</span>
                        <span className="font-medium text-gray-900">{selectedPackage.additionalItems.editedImages}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Unedited Images:</span>
                        <span className="font-medium text-gray-900">{selectedPackage.additionalItems.uneditedImages}</span>
                    </div>
                    
                    {albums.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Albums:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                                {albums.map((album, index) => (
                                    <li key={index} className="text-gray-600">
                                        {album.size} {album.type} (Spread Count: {album.spreadCount})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {framedPortraits.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Framed Portraits:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                                {framedPortraits.map((portrait, index) => (
                                    <li key={index} className="text-gray-600">
                                        {portrait.size} (Quantity: {portrait.quantity})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedPackage.additionalItems.thankYouCards && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Thank You Cards:</span>
                            <span className="font-medium text-gray-900">{selectedPackage.additionalItems.thankYouCards}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageDetails; 