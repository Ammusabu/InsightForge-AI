interface InsightStatProps {
    title: string;
    value: string;
    color?: string;
}

export default function InsightStat({
    title,
    value,
    color = "text-green-400",
}: InsightStatProps) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-800 p-3">

            <span className="text-sm text-slate-400">
                {title}
            </span>

            <span className={`font-semibold ${color}`}>
                {value}
            </span>

        </div>
    );
}