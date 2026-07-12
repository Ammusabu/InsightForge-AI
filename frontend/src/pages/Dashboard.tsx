import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import KpiCard from "../components/dashboard/KpiCard";

import { getDatasets } from "../services/datasetService";

import type { Dataset } from "../types/dataset";

export default function Dashboard() {
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    useEffect(() => {
        async function loadDatasets() {
            try {
                const response = await getDatasets();

                setDatasets(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        loadDatasets();
    }, []);

    return (
        <DashboardLayout>

            <div className="space-y-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Welcome to InsightForge AI.
                    </p>

                </div>

                <div className="grid grid-cols-4 gap-6">

                    <KpiCard
                        title="Datasets"
                        value={datasets.length}
                    />

                    <KpiCard
                        title="Rows"
                        value={
                            datasets.reduce(
                                (sum, dataset) =>
                                    sum + dataset.profile.rows,
                                0
                            )
                        }
                    />

                    <KpiCard
                        title="AI Reports"
                        value={0}
                    />

                    <KpiCard
                        title="Forecasts"
                        value={0}
                    />

                </div>

            </div>

        </DashboardLayout>
    );
}