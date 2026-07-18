import api from "./api";

export async function deleteDataset(
    datasetId: string
) {
    return await api.delete(
        `/datasets/${datasetId}`
    );
}