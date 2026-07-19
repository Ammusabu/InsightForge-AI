import type { InputHTMLAttributes } from "react";
interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
    className = "",
    ...props
}: InputProps) {
    return (
        <input
            {...props}
            className={`
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
                text-white
                placeholder:text-slate-500
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                ${className}
            `}
        />
    );
}