import { Link } from "react-router-dom";

interface SidebarItemProps {
    icon: string;
    label: string;
    to: string;
}

export default function SidebarItem({
    icon,
    label,
    to,
}: SidebarItemProps) {
    return (
        <Link
            to={to}
            className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-slate-300
                transition-all
                duration-200
                hover:bg-slate-800
                hover:text-white
            "
        >
            <span className="text-lg">
                {icon}
            </span>

            <span className="font-medium">
                {label}
            </span>
        </Link>
    );
}