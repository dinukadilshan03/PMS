// src/components/ui/input.tsx
import React from "react";

interface InputProps {
    type?: string;
    name?: string;
    value: string| number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    min?: string | number; // Add min property
    max?: string | number; // Add max property
}

const Input: React.FC<InputProps> = ({ type = "text", name, value, onChange, placeholder, className, required, min, max }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            min={min} // Now supporting min
            max={max} // Now supporting max
            className={`px-4 py-2 border rounded-md ${className}`}
        />
    );
};

export { Input };
