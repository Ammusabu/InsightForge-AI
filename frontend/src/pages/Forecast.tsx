import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SectionHeader from "../components/ui/SectionHeader";
import ForecastForm from "../components/forecast/ForecastForm";
import ForecastChart from "../components/forecast/ForecastChart";

import { generateForecast } from "../services/forecastService";
import { useDataset } from "../context/DatasetContext";
import { getAnalytics } from "../services/analyticsService";

export default function Forecast() {

    const { selectedDatasetId } = useDataset();

const [forecast, setForecast] =
    useState<number[]>([]);

const [numericColumns, setNumericColumns] =
    useState<string[]>([]);

useEffect(() => {

    if (!selectedDatasetId) {

        setNumericColumns([]);
        return;

    }

    async function loadColumns() {

        try {

            const analytics =
                await getAnalytics(selectedDatasetId);

            setNumericColumns(
                analytics.numeric_columns
            );

        } catch (error) {

            console.error(error);

        }

    }

    loadColumns();

}, [selectedDatasetId]);

    async function handleGenerate(
        column: string,
        periods: number,
    ) {

        if (!selectedDatasetId) {
            alert("Please select a dataset first.");
            return;
        }

        try {

            const response =
                await generateForecast(
                    selectedDatasetId,
                    column,
                    periods,
                );

            setForecast(
                response.forecast
            );

        } catch (error) {
            console.error(error);
            alert("Failed to generate forecast.");
        }
    }

    return (
        <DashboardLayout>

            <div className="space-y-8">

                <SectionHeader
                    title="Forecasting"
                    subtitle="Predict future values using AI."
                />

                <ForecastForm
    columns={numericColumns}
    onGenerate={handleGenerate}
                />
                {forecast.length > 0 && (

<div className="grid grid-cols-3 gap-6">

    <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">
            Average Prediction
        </p>

        <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {Math.round(
                forecast.reduce((a, b) => a + b, 0) /
                forecast.length
            )}
        </h2>
    </div>

    <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">
            Highest
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400">
            {Math.round(Math.max(...forecast))}
        </h2>
    </div>

    <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">
            Lowest
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-400">
            {Math.round(Math.min(...forecast))}
        </h2>
    </div>

</div>

)}

                <ForecastChart
                    forecast={forecast}
                />
                {forecast.length > 0 && (

<div className="rounded-xl bg-slate-900 p-6">

    <h2 className="mb-4 text-xl font-bold">
        🤖 AI Interpretation
    </h2>

    <p className="text-slate-300">

        The selected feature is predicted over the next{" "}
        <strong>{forecast.length}</strong> periods.

        The average predicted value is{" "}
        <strong>
            {Math.round(
                forecast.reduce((a, b) => a + b, 0) /
                forecast.length
            )}
        </strong>.

    </p>

</div>

)}

            </div>

        </DashboardLayout>
    );
}