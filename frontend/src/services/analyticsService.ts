import api from "./api";

export async function getAnalytics(
    datasetId: string
) {
    const response = await api.get(
        `/analytics/${datasetId}/overview`
    );

    return response.data.data;
}