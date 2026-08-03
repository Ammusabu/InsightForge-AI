import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface UploadStatus {
  status: 'processing' | 'ready' | 'error' | 'not_found';
  progress: number;
  message: string;
  updated_at: string;
}

export const uploadService = {
  async uploadDataset(file: File): Promise<{ datasetId: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE}/upload/csv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      datasetId: response.data.data.dataset_id,
    };
  },

  async checkStatus(datasetId: string): Promise<UploadStatus> {
    const response = await axios.get(`${API_BASE}/processing/${datasetId}`);
    return response.data.data;
  },

  async waitForReady(
    datasetId: string,
    onProgress?: (status: UploadStatus) => void,
    interval: number = 2000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const status = await this.checkStatus(datasetId);
          
          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'ready') {
            clearInterval(timer);
            resolve();
          } else if (status.status === 'error') {
            clearInterval(timer);
            reject(new Error(status.message || 'Processing failed'));
          }
        } catch (error) {
          clearInterval(timer);
          reject(error);
        }
      };

      const timer = setInterval(checkStatus, interval);
      checkStatus();
    });
  }
};