import {
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface KpiCardProps {
    title: string;
    value: number | string;
    icon: string;
    change: string;
    subtitle: string;
    positive?: boolean;
}

export default function KpiCard({
    title,
    value,
    icon,
    change,
    subtitle,
    positive = true,
}: KpiCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-blue-500/20">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">
                        {icon}
                    </div>

                    <div>

                        <p className="text-sm text-slate-400">
                            {title}
                        </p>

                        <h2 className="text-3xl font-bold text-white">
                            {value}
                        </h2>

                    </div>

                </div>

                <div
                    className={`flex items-center gap-1 ${
                        positive
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
                    {positive ? (
                        <TrendingUp size={18} />
                    ) : (
                        <TrendingDown size={18} />
                    )}

                    <span>{change}</span>

                </div>

            </div>

            <p className="mt-5 text-sm text-slate-500">
                {subtitle}
            </p>

        </div>
    );
}