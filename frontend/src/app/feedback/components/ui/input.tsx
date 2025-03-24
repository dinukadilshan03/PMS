// src/components/ui/input.tsx
import React from "react";

interface InputProps {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({ type = "text", value, onChange, placeholder, className }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`px-4 py-2 border rounded-md ${className}`}
        />
    );
};

export { Input };
