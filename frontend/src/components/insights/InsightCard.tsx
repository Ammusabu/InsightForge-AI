import InsightStat from "./InsightStat";

interface InsightCardProps {
    insights: string[];
}

export default function InsightCard({
    insights,
}: InsightCardProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

            <h2 className="mb-6 text-xl font-bold text-white">
                🤖 AI Overview
            </h2>

            <div className="space-y-3">

                <InsightStat
                    title="Dataset Health"
                    value="Excellent"
                />

                <InsightStat
                    title="Trend"
                    value="Increasing"
                />

                <InsightStat
                    title="Prediction"
                    value="+14%"
                />

                <InsightStat
                    title="Risk"
                    value="Low"
                />

            </div>

            <div className="mt-6 rounded-xl bg-blue-600/10 p-4">

                <p className="text-sm text-blue-300">

                    💡 <strong>AI Recommendation</strong>

                </p>

                <p className="mt-2 text-sm text-slate-300">

                    {insights.length > 0
                        ? insights[0]
                        : "Upload a dataset to receive AI insights."}

                </p>

            </div>

        </div>
    );
}