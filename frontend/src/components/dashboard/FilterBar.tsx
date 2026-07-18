import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useFilters } from "../../context/FilterContext";
import { useDataset } from "../../context/DatasetContext";

import { getFilterOptions } from "../../services/filterService";

import type { FilterOptions } from "../../types/filter";

export default function FilterBar() {

    const { filters, setFilters } = useFilters();

    const { selectedDatasetId } = useDataset();

    const [options, setOptions] =
        useState<FilterOptions>({
            categories: [],
            countries: [],
        });
        useEffect(() => {
            console.log("Selected Dataset:", selectedDatasetId);
        }, [selectedDatasetId]);

    useEffect(() => {

        if (!selectedDatasetId) {
            return;
        }

        async function loadFilters() {

            try {

                console.log("Calling Filters API...");

const data =
    await getFilterOptions(
        selectedDatasetId
    );

    console.log("Categories:", data.categories);
    console.log("Countries:", data.countries);

    console.log("Raw data:", data);

    setOptions({
        categories: data.categories ?? [],
        countries: data.countries ?? [],
    });

            } catch (error) {

                console.error(error);

            }

        }

        loadFilters();

    }, [selectedDatasetId]);
    
    useEffect(() => {

        console.log(filters);
    
    }, [filters]);

    return (

        
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

    <div className="grid grid-cols-4 gap-4">

        {/* Search */}

        <div className="relative">

            <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                    }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
            />

        </div>

        {/* Category */}

        <select
            value={filters.category}
            onChange={(e) =>
                setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                }))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        >

            <option value="">
                All Categories
            </option>

            {options.categories.map((category) => (

                <option
                    key={category}
                    value={category}
                >
                    {category}
                </option>

            ))}

        </select>
                        {/* Country */}

        <select
            value={filters.country}
            onChange={(e) =>
                setFilters((prev) => ({
                    ...prev,
                    country: e.target.value,
                }))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        >

            <option value="">
                All Countries
            </option>

            {options.countries.map((country) => (

                <option
                    key={country}
                    value={country}
                >
                    {country}
                </option>

            ))}

        </select>

        {/* Reset */}

        <button
            onClick={() =>
                setFilters({
                    search: "",
                    category: "",
                    country: "",
                })
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
            Reset Filters
        </button>

    </div>

</div>

    );
}
