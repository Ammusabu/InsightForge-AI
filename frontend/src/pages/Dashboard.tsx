import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import Hero from "../components/home/Hero";
import QuickActions from "../components/home/QuickActions";
import RecentActivity from "../components/home/RecentActivity";
import AIAssistantCard from "../components/home/AIAssistantCard";

import KpiCard from "../components/dashboard/KpiCard";
import LineChartCard from "../components/charts/LineChartCard";
import BarChartCard from "../components/charts/BarChartCard";
import DatasetPreview from "../components/dataset/DatasetPreview";
import AnalyticsCard from "../components/analytics/AnalyticsCard";
import InsightCard from "../components/insights/InsightCard";

import FloatingChatButton from "../components/chat/FloatingChatButton";
import ChatDrawer from "../components/chat/ChatDrawer";

import { getDashboardSummary } from "../services/dashboardService";
import { getDataset } from "../services/datasetDetailService";
import { getAnalytics } from "../services/analyticsService";
import {
    getLineChart,
    getBarChart,
} from "../services/chartService";
import { getInsights } from "../services/insightService";

import { useDataset } from "../context/DatasetContext";

import type { DashboardSummary } from "../types/dashboard";

import type { DatasetDetail } from "../types/datasetDetail";
import type { AnalyticsOverview } from "../types/analytics";
import type {
    LineChartPoint,
    BarChartPoint,
} from "../types/charts";
import FilterBar from "../components/dashboard/FilterBar";
import TourismMap from "../components/maps/TourismMap";

export default function Dashboard() {

    const [summary, setSummary] =
    useState<DashboardSummary>({
        datasets: 0,
        rows: 0,
        columns: 0,
    });

const [dataset, setDataset] =
    useState<DatasetDetail | null>(null);

const [analytics, setAnalytics] =
    useState<AnalyticsOverview | null>(null);

const [lineChartData, setLineChartData] =
    useState<LineChartPoint[]>([]);

const [barChartData, setBarChartData] =
    useState<BarChartPoint[]>([]);

const [insights, setInsights] =
    useState<string[]>([]);

const [chatOpen, setChatOpen] =
    useState(false);

const { selectedDatasetId } =
    useDataset();
    useEffect(() => {

        async function loadSummary() {
    
            try {
    
                const data =
                    await getDashboardSummary();
    
                setSummary(data);
    
            } catch (error) {
    
                console.error(error);
    
            }
    
        }
    
        loadSummary();
    
    }, []);

    useEffect(() => {

        if (!selectedDatasetId) {
    
            setDataset(null);
            setAnalytics(null);
            setLineChartData([]);
            setBarChartData([]);
            setInsights([]);
    
            return;
    
        }
    
        async function loadDatasetData() {
    
            try {
    
                const [
                    datasetData,
                    analyticsData,
                    lineData,
                    barData,
                    insightsData,
                ] = await Promise.all([
                    getDataset(selectedDatasetId),
                    getAnalytics(selectedDatasetId),
                    getLineChart(selectedDatasetId),
                    getBarChart(selectedDatasetId),
                    getInsights(selectedDatasetId),
                ]);
    
                setDataset(datasetData);
                setAnalytics(analyticsData);
                console.log("Analytics Data:", analyticsData);
                setLineChartData(lineData);
                setBarChartData(barData);
                setInsights(insightsData);
    
            } catch (error) {
    
                console.error(error);
    
            }
    
        }
    
        loadDatasetData();
    
    }, [selectedDatasetId]);


return (

    <AppLayout>

        <div className="space-y-8">

            <Hero />
            <FilterBar />

            <div className="grid grid-cols-4 gap-6">




            <KpiCard
    title="Datasets"
    value={summary.datasets}
    icon="📁"
    change="+12%"
    subtitle="Available datasets"
/>

<KpiCard
    title="Rows"
    value={summary.rows}
    icon="📊"
    change="+8%"
    subtitle="Records processed"
/>

<KpiCard
    title="Columns"
    value={summary.columns}
    icon="📋"
    change="+5%"
    subtitle="Features detected"
/>

<KpiCard
    title="AI Reports"
    value={0}
    icon="🤖"
    change="+22%"
    subtitle="Generated reports"
/>

            </div>

            {/* First Row */}

<div className="grid grid-cols-3 gap-6">

<div className="col-span-2">

    <LineChartCard
        data={lineChartData}
    />

</div>

<InsightCard
    insights={insights}
/>

</div>

{/* Second Row */}

{/* Second Row */}

<div className="grid grid-cols-2 gap-6">

    <AnalyticsCard
        analytics={analytics}
    />

    <TourismMap />

</div>

{/* Third Row */}

<div className="grid grid-cols-2 gap-6">

<RecentActivity />

<QuickActions />

</div>

{/* Bottom */}

<BarChartCard
data={barChartData}
/>

        </div>

        <FloatingChatButton
            onClick={() => setChatOpen(true)}
        />

        <ChatDrawer
            open={chatOpen}
            onClose={() => setChatOpen(false)}
        />

    </AppLayout>

);

}