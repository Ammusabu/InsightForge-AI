import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { DashboardFilters } from "../types/filter";

interface FilterContextType {
    filters: DashboardFilters;
    setFilters: React.Dispatch<
        React.SetStateAction<DashboardFilters>
    >;
}

const FilterContext =
    createContext<FilterContextType | null>(null);

export function FilterProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [filters, setFilters] =
        useState<DashboardFilters>({
            search: "",
            category: "",
            country: "",
        });

    return (
        <FilterContext.Provider
            value={{
                filters,
                setFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context =
        useContext(FilterContext);

    if (!context) {
        throw new Error(
            "useFilters must be used inside FilterProvider"
        );
    }

    return context;
}
