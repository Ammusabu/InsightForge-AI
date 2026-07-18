import api from "./api";

export async function generateForecast(
    datasetId: string,
    column: string,
    periods: number,
) {
    const response = await api.post(
        "/forecast/",
        {
            dataset_id: datasetId,
            column,
            periods,
        }
    );

    return response.data.data;
}