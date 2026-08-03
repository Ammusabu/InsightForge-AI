import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import DatasetItem from "../dashboard/DatasetItem";
import UploadButton from "../upload/UploadButton";

import { getDatasets } from "../../services/datasetService";
import { uploadService } from "../../services/uploadService";
import { deleteDataset } from "../../services/deleteDatasetService";
import { useDataset } from "../../context/DatasetContext";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

// NEW: Import the upload service with progress

interface Dataset {
    dataset_id: string;
    filename: string;
}

export default function Sidebar() {
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    // NEW: Upload progress states
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'ready' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

    const {
        selectedDatasetId,
        setSelectedDatasetId,
    } = useDataset();

    async function loadDatasets() {
        try {
            const response = await getDatasets();
            setDatasets(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadDatasets();
    }, []);

    // REPLACE: This is the new handleUpload with progress
    async function handleUpload(file: File) {
        setUploadStatus('uploading');
        setUploadProgress(0);
        setUploadMessage('Uploading file...');

        try {
            // Use the new upload service that returns datasetId
            const { datasetId } = await uploadService.uploadDataset(file);
            
            setUploadStatus('processing');
            setUploadMessage('Processing dataset...');

            // Poll for status updates
            await uploadService.waitForReady(
                datasetId,
                (status) => {
                    setUploadProgress(status.progress);
                    setUploadMessage(status.message);
                },
                2000 // Check every 2 seconds
            );

            setUploadStatus('ready');
            setUploadMessage('Dataset ready!');
            
            // Refresh the dataset list
            await loadDatasets();
            setSelectedDatasetId(datasetId);

            
            // Auto-reset after 3 seconds
            setTimeout(() => {
                setUploadStatus('idle');
                setUploadProgress(0);
                setUploadMessage('');
            }, 3000);

        } catch (error: any) {
            setUploadStatus('error');
            setUploadMessage(error.message || 'Upload failed');
            console.error('Upload error:', error);
            
            // Reset after 5 seconds on error
            setTimeout(() => {
                setUploadStatus('idle');
                setUploadProgress(0);
                setUploadMessage('');
            }, 5000);
        }
    }

    async function handleDelete(datasetId: string) {
        const confirmed = window.confirm(
            "Delete this dataset?"
        );
    
        if (!confirmed) return;
    
        try {
            await deleteDataset(datasetId);
    
            if (selectedDatasetId === datasetId) {
                setSelectedDatasetId(null);
            }
    
            await loadDatasets();
    
        } catch (error) {
            console.error(error);
            alert("Failed to delete dataset.");
        }
    }

    return (
        <aside className="h-screen w-72 overflow-y-auto border-r border-slate-700 bg-slate-900 p-6">

            <h1 className="mb-8 text-2xl font-bold text-white">
                InsightForge AI
            </h1>

            {/* Navigation */}
            <div className="mb-8">
                <SidebarSection title="Main">
                    <SidebarItem
                        icon="🏠"
                        label="Dashboard"
                        to="/"
                    />
                    <SidebarItem
                        icon="📊"
                        label="Analytics"
                        to="/analytics"
                    />
                    <SidebarItem
                        icon="📈"
                        label="Forecast"
                        to="/forecast"
                    />
                    <SidebarItem
                        icon="📄"
                        label="Reports"
                        to="/reports"
                    />
                    <SidebarItem
                        icon="📊"
                        label="Power BI"
                        to="/powerbi"
                    />
                </SidebarSection>
            </div>

            {/* Dataset Section */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Uploaded Datasets
                </h2>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                    {datasets.length}
                </span>
            </div>

            <UploadButton onSelect={handleUpload} />

            {/* NEW: Upload Progress UI */}
            {uploadStatus !== 'idle' && (
                <div className="mt-4 rounded-xl bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                            uploadStatus === 'error' ? 'text-red-400' : 
                            uploadStatus === 'ready' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                            {uploadMessage}
                        </span>
                        <span className="text-sm text-slate-400">{uploadProgress}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-700">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                uploadStatus === 'error' ? 'bg-red-500' : 
                                uploadStatus === 'ready' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sample Dataset
                </h3>
                <div className="rounded-xl border border-blue-500/30 bg-slate-800 p-4">
                    <h4 className="font-semibold text-white">
                        🌍 Tourism Analytics Dataset
                    </h4>
                    <p className="mt-1 text-xs text-slate-400">
                        6000 Records • 48 Destinations
                    </p>
                    <a
                        href="/tourism_sample_dataset.csv"
                        download
                        className="mt-3 inline-block rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        ⬇ Download Sample Dataset
                    </a>
                </div>
            </div>

            <div className="mt-6 space-y-3 pb-8">
                {datasets.map((dataset) => (
                    <div
                        key={dataset.dataset_id}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                                setSelectedDatasetId(dataset.dataset_id)
                            }
                        >
                            <div
                                className={
                                    selectedDatasetId === dataset.dataset_id
                                        ? "rounded-lg ring-2 ring-blue-500"
                                        : ""
                                }
                            >
                                <DatasetItem
                                    name={dataset.filename}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                handleDelete(dataset.dataset_id)
                            }
                            className="rounded-lg p-2 text-red-400 hover:bg-slate-800"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

        </aside>
    );
}