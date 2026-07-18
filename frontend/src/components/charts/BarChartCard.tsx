import {
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from "recharts";

import type { BarChartPoint } from "../../types/charts";

interface Props {
    data: BarChartPoint[];
}

export default function BarChartCard({
    data,
}: Props) {
    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="mb-4 text-lg font-semibold">
                Category Distribution
            </h2>

            <div className="h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="value"
                            fill="#22c55e"
                            radius={[6, 6, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}