// src/components/ui/textarea.tsx
import React from "react";

interface TextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange, placeholder, className }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`px-4 py-2 border rounded-md resize-none ${className}`}
        />
    );
};

export { Textarea };
