interface BadgeProps {
    children: React.ReactNode;
    color?: "blue" | "green" | "red" | "yellow";
}

export default function Badge({
    children,
    color = "blue",
}: BadgeProps) {

    const colors = {
        blue: "bg-blue-600/20 text-blue-300",
        green: "bg-green-600/20 text-green-300",
        red: "bg-red-600/20 text-red-300",
        yellow: "bg-yellow-600/20 text-yellow-300",
    };

    return (
        <span
            className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${colors[color]}
            `}
        >
            {children}
        </span>
    );
}