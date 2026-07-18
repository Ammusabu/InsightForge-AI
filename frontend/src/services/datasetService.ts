import api from "./api";

export async function getDatasets() {
    const response = await api.get("/datasets");

    return response.data;
}