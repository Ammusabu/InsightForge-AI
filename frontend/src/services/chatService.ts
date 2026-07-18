import api from "./api";

export async function askAI(
    datasetId: string,
    question: string
) {
    const response = await api.post("/chat/", {
        dataset_id: datasetId,
        question,
    });

    return response.data.data.answer;
}