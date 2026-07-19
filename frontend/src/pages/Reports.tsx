import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SectionHeader from "../components/ui/SectionHeader";
import GenerateReportButton from "../components/report/GenerateReportButton";
import ReportViewer from "../components/report/ReportViewer";

import { generateReport } from "../services/reportService";
import { useDataset } from "../context/DatasetContext";
import DownloadPdfButton from "../components/report/DownloadPdfButton";
import { generatePdfReport } from "../services/pdfServiceNew";


export default function Reports() {
    const [report, setReport] = useState<any>(null);

    const { selectedDatasetId } = useDataset();

    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        if (!selectedDatasetId) {
            alert("Please select a dataset first.");
            return;
        }
    
        try {
            setLoading(true);
    
            const aiReport = await generateReport(selectedDatasetId);
    
            console.log("REPORT OBJECT");
            console.log(aiReport);

            setReport(aiReport);
    
        } catch (error) {
    
            console.error(error);
            alert("Failed to generate report.");
    
        } finally {
    
            setLoading(false);
    
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
                    loading={loading}
                />
                {report && (
                <DownloadPdfButton
                    onDownload={() =>
                        generatePdfReport(report)
                         
                    
                        }
                />
           )}
                <ReportViewer
                    report={report}
                />

            </div>
            {/* {report && (
    <div
        style={{
            position: "absolute",
            left: "-9999px",
            top: 0
        }}
    >
        <PdfReport report={report} />
    </div>
)} */}

        </DashboardLayout>
    );
}