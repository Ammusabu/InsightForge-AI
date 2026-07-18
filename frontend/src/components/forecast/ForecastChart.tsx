import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface ForecastChartProps {
    forecast: number[];
}

export default function ForecastChart({
    forecast,
}: ForecastChartProps) {

    const data = forecast.map(
        (value, index) => ({
            period: index + 1,
            value,
        })
    );

    if (forecast.length === 0) {
        return (
            <div className="rounded-xl bg-slate-800 p-8 text-center text-slate-400">
                No forecast generated yet.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="mb-6 text-xl font-bold">
                Forecast Results
            </h2>

            <div className="h-96">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="period" />

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