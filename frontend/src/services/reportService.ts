import api from "./api";

export async function generateReport(
    datasetId: string
) {
    const response = await api.post(
        "/chat/report",
        {
            dataset_id: datasetId,
        }
    );

    return response.data.data.report;
}