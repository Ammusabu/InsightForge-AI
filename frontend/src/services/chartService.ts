import api from "./api";

export async function getLineChart(
    datasetId: string
) {
    const response = await api.get(
        `/analytics/${datasetId}/line-chart`
    );

    return response.data.data;
}

export async function getBarChart(
    datasetId: string
) {
    const response = await api.get(
        `/analytics/${datasetId}/bar-chart`
    );

    return response.data.data;
}