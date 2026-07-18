import api from "./api";

export async function uploadDataset(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/upload/csv",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}