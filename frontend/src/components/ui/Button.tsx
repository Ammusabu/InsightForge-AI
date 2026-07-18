import { ButtonHTMLAttributes } from "react";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({
    children,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={`
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-blue-700
                hover:scale-105
                disabled:opacity-50
                ${className}
            `}
        >
            {children}
        </button>
    );
}