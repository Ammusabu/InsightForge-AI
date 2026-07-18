import type { ReactNode } from "react";

interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function Card({
    title,
    children,
    className = "",
}: CardProps) {
    return (
        <div
            className={`
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
                shadow-lg
                ${className}
            `}
        >
            {title && (
                <h2 className="mb-5 text-lg font-semibold text-white">
                    {title}
                </h2>
            )}

            {children}
        </div>
    );
}