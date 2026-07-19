import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

export async function generateReport(datasetId: string) {
    const response = await axios.post(
        `${API}/chat/report`,
        {
            dataset_id: datasetId,
        }
    );

    return response.data;
}