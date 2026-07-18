import api from "./api";

export async function getCorrelation(
    datasetId: string
) {
    const response = await api.get(
        `/analytics/${datasetId}/correlation`
    );

    return response.data.data;
}