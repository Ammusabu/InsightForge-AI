import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import type { LineChartPoint } from "../../types/charts";

interface Props {
    data: LineChartPoint[];
}

export default function LineChartCard({
    data,
}: Props) {
    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="mb-4 text-lg font-semibold">
                Numeric Trend
            </h2>

            <div className="h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="index" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}