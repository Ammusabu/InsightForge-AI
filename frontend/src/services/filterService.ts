import api from "./api";

import type { FilterOptions } from "../types/filter";

export async function getFilterOptions(
    datasetId: string
): Promise<FilterOptions> {

    const response = await api.get(
        `/filters/${datasetId}`
    );

    return response.data;
}