import { useState } from 'react';

interface EditFeedbackDialogProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: {
        id: string;
        content: string;
        rating: number;
        packageName: string;
    };
    onSave: (id: string, content: string, rating: number, packageName: string) => void;
    packages: Array<{ id: string; name: string }>;
}

export default function EditFeedbackDialog({ isOpen, onClose, feedback, onSave, packages }: EditFeedbackDialogProps) {
    const [content, setContent] = useState(feedback.content);
    const [rating, setRating] = useState(feedback.rating);
    const [packageName, setPackageName] = useState(feedback.packageName);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(feedback.id, content, rating, packageName);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Edit Feedback</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Package</label>
                        <select
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.name}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between">
                            <span>1 ★</span>
                            <span>2 ★</span>
                            <span>3 ★</span>
                            <span>4 ★</span>
                            <span>5 ★</span>
                        </div>
                        <div className="text-center mt-1">
                            Current: {rating} ★
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Feedback Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 