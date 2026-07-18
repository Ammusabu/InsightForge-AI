import api from "./api";

export async function getDataset(datasetId: string) {
    const response = await api.get(`/datasets/${datasetId}`);

    return response.data.data;
}