import AppLayout from "../components/layout/AppLayout";
import AnalyticsStats from "../components/analytics/AnalyticsStats";
import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsService";
import { useDataset } from "../context/DatasetContext";

import type { AnalyticsOverview } from "../types/analytics";
import ColumnExplorer from "../components/analytics/ColumnExplorer";

export default function Analytics() {
    const { selectedDatasetId } = useDataset();

const [analytics, setAnalytics] =
    useState<AnalyticsOverview | null>(null);

useEffect(() => {

    if (!selectedDatasetId) return;

    async function loadAnalytics() {

        try {

            const data =
                await getAnalytics(selectedDatasetId);

            setAnalytics(data);

        } catch (error) {

            console.error(error);

        }

    }

    loadAnalytics();

}, [selectedDatasetId]);

    return (

        <AppLayout>

            <div className="space-y-8">

                {/* Header */}

                <div>

                    <h1 className="text-4xl font-bold text-white">
                        📊 Analytics Center
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Advanced dataset exploration and statistical analysis
                    </p>

                </div>

                {/* Statistics */}

                {analytics && (

<AnalyticsStats
    rows={analytics.rows}
    columns={analytics.columns}
    memory={analytics.memory_mb}
    missing={analytics.missing_values}
/>

)}

                {/* Dataset Quality */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-6 text-2xl font-bold text-white">
                        Dataset Quality
                    </h2>

                    <div className="grid grid-cols-3 gap-6">

                        <div className="rounded-xl bg-slate-800 p-5">

                            <p className="text-slate-400">
                                Quality Score
                            </p>

                            <h3 className="mt-2 text-4xl font-bold text-green-400">
    {analytics
        ? Math.max(
              100 -
                  analytics.missing_values -
                  analytics.duplicate_rows,
              0
          )
        : 0}
    %
</h3>

                        </div>

                        <div className="rounded-xl bg-slate-800 p-5">

                            <p className="text-slate-400">
                                Duplicate Rows
                            </p>

                            <h3 className="mt-2 text-4xl font-bold text-white">
    {analytics?.duplicate_rows ?? 0}
</h3>

                        </div>

                        <div className="rounded-xl bg-slate-800 p-5">

                            <p className="text-slate-400">
                                Status
                            </p>

                            <h3
    className={`mt-2 text-2xl font-bold ${
        analytics &&
        analytics.missing_values === 0 &&
        analytics.duplicate_rows === 0
            ? "text-green-400"
            : "text-yellow-400"
    }`}
>
    {analytics &&
    analytics.missing_values === 0 &&
    analytics.duplicate_rows === 0
        ? "Excellent"
        : "Needs Cleaning"}
</h3>

                        </div>

                    </div>

                </div>

                {/* AI Summary */}

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

<h2 className="mb-6 text-2xl font-bold text-white">
    🤖 AI Dataset Summary
</h2>

<ul className="space-y-3 text-slate-300">

<li>
    ✅ Rows: {analytics?.rows ?? 0}
</li>

<li>
    ✅ Columns: {analytics?.columns ?? 0}
</li>

<li>
    ✅ Numeric Columns: {analytics?.numeric_columns.length ?? 0}
</li>

<li>
    ✅ Categorical Columns: {analytics?.categorical_columns.length ?? 0}
</li>

<li>
    ✅ Datetime Columns: {analytics?.datetime_columns.length ?? 0}
</li>

<li>
    ⚠ Missing Values: {analytics?.missing_values ?? 0}
</li>

</ul>

</div>

{/* Column Explorer */}

{analytics && (

<ColumnExplorer
    analytics={analytics}
/>

)}

</div>

</AppLayout>


    );

}


