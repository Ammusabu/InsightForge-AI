export interface AnalyticsOverview {
    rows: number;
    columns: number;
    missing_values: number;
    duplicate_rows: number;
    memory_mb: number;
    numeric_columns: string[];
    categorical_columns: string[];
    datetime_columns: string[];
}