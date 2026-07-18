import api from "./api";

export async function getInsights(datasetId: string) {
    const response = await api.get(
        `/analytics/${datasetId}/insights`
    );

    return response.data.data;
}