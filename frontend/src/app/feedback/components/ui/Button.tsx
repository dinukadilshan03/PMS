// src/components/ui/button.tsx
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded bg-blue-500 text-white ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
