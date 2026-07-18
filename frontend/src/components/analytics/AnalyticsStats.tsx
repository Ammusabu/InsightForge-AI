interface Props {
    rows: number;
    columns: number;
    memory: number;
    missing: number;
}

export default function AnalyticsStats({
    rows,
    columns,
    memory,
    missing,
}: Props) {

    const cards = [
        {
            title: "Rows",
            value: rows,
            icon: "📄",
        },
        {
            title: "Columns",
            value: columns,
            icon: "📋",
        },
        {
            title: "Memory",
            value: `${memory} MB`,
            icon: "💾",
        },
        {
            title: "Missing",
            value: missing,
            icon: "⚠️",
        },
    ];

    return (

        <div className="grid grid-cols-4 gap-6">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >

                    <div className="mb-4 flex items-center justify-between">

                        <span className="text-3xl">
                            {card.icon}
                        </span>

                        <span className="text-sm text-slate-400">
                            {card.title}
                        </span>

                    </div>

                    <h2 className="text-3xl font-bold text-white">
                        {card.value}
                    </h2>

                </div>

            ))}

        </div>

    );

}