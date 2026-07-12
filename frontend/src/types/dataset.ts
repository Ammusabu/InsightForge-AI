export interface Dataset {
    dataset_id: string;
    profile: {
        rows: number;
        columns: number;
    };
}