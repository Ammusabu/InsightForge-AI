import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionHeader from "../components/ui/SectionHeader";
import GenerateReportButton from "../components/report/GenerateReportButton";
import ReportViewer from "../components/report/ReportViewer";

import { generateReport } from "../services/reportService";
import { useDataset } from "../context/DatasetContext";
import DownloadPdfButton from "../components/report/DownloadPdfButton";
import { downloadReportPDF } from "../services/pdfService";
import PdfReport from "../components/report/PdfReport";


export default function Reports() {
    const [report, setReport] = useState<any>(null);

    const { selectedDatasetId } = useDataset();

    async function handleGenerate() {
        if (!selectedDatasetId) {
            alert("Please select a dataset first.");
            return;
        }

        try {
            const aiReport = await generateReport(
                selectedDatasetId
            );
            console.log(aiReport);

            setReport(aiReport);

        } catch (error) {
            console.error(error);
            alert("Failed to generate report.");
        }
    }

    return (
        <DashboardLayout>

            <div className="space-y-8">

                <SectionHeader
                    title="AI Reports"
                    subtitle="Generate professional business reports using AI."
                />

                <GenerateReportButton
                    onGenerate={handleGenerate}
                />
                {report && (
                <DownloadPdfButton
                    onDownload={() =>
                         downloadReportPDF(report)
                    
                        }
                />
           )}
                <ReportViewer
                    report={report}
                />

            </div>
            {report && (
    <div
        style={{
            position: "absolute",
            left: "-9999px",
            top: 0
        }}
    >
        <PdfReport report={report} />
    </div>
)}

        </DashboardLayout>
    );
}