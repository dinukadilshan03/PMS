// src/components/ui/textarea.tsx
import React from "react";

interface TextareaProps {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ name, value, onChange, placeholder, className, required  }) => {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`px-4 py-2 border rounded-md resize-none ${className}`}
        />
    );
};

export { Textarea };
