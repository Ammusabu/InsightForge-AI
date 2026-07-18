import { useEffect, useState } from "react";
interface ForecastFormProps {
    columns: string[];
    onGenerate: (
        column: string,
        periods: number,
    ) => void;
}

export default function ForecastForm({
    columns,
    onGenerate,
}: ForecastFormProps) {

    const [column, setColumn] =
        useState("");
        useEffect(() => {

            if (
                columns.length > 0 &&
                !column
            ) {
                setColumn(columns[0]);
            }
        
        }, [columns]);

    const [periods, setPeriods] =
        useState(12);

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                📈 Forecast Configuration
            </h2>

            <div className="grid grid-cols-3 gap-4">

                <select
                    value={column}
                    onChange={(e) =>
                        setColumn(e.target.value)
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                >

                    <option value="">
                        Select Column
                    </option>

                    {columns.map((col) => (

                        <option
                            key={col}
                            value={col}
                        >
                            {col}
                        </option>

                    ))}

                </select>

                <input
                    type="number"
                    value={periods}
                    onChange={(e) =>
                        setPeriods(Number(e.target.value))
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />

                <button
                    onClick={() =>
                        onGenerate(
                            column,
                            periods
                        )
                    }
                    className={`rounded-xl font-semibold text-white transition ${
                        column
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "cursor-not-allowed bg-slate-700"
                    }`}
                                    >
                    Generate Forecast
                </button>

            </div>

        </div>

    );

}