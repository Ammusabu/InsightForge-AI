import type { AnalyticsOverview } from "../../types/analytics";

interface Props {
    analytics: AnalyticsOverview | null;
}

export default function AnalyticsCard({
    analytics,
}: Props) {

    if (!analytics) {
        return (
            <div className="rounded-xl bg-slate-800 p-6">
                Select a dataset to view analytics.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="mb-6 text-xl font-bold">
                Dataset Analytics
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <Stat
                    label="Rows"
                    value={analytics.rows}
                />

                <Stat
                    label="Columns"
                    value={analytics.columns}
                />

                <Stat
                    label="Memory"
                    value={`${analytics.memory_mb} MB`}
                />

                <Stat
                    label="Missing Values"
                    value={analytics.missing_values}
                />

                <Stat
                    label="Duplicate Rows"
                    value={analytics.duplicate_rows}
                />

                <Stat
                    label="Numeric Columns"
                    value={analytics.numeric_columns.length}
                />

                <Stat
                    label="Categorical Columns"
                    value={analytics.categorical_columns.length}
                />

                <Stat
                    label="Datetime Columns"
                    value={analytics.datetime_columns.length}
                />

            </div>

        </div>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-lg bg-slate-900 p-4">

            <p className="text-sm text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold">
                {value}
            </p>

        </div>
    );
}