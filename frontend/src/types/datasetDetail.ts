export interface DatasetDetail {
    dataset_id: string;
    filename: string;
    columns: string[];
    preview: Record<string, unknown>[];
    profile: {
        rows: number;
        columns: number;
    };
}