// src/components/ui/button.tsx
import React from "react";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ type = "button",children, onClick, className }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded bg-blue-500 text-white ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
