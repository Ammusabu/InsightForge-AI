import type { CorrelationData } from "../../types/correlation";

interface Props {
    correlation: CorrelationData | null;
}

export default function CorrelationCard({
    correlation,
}: Props) {
    if (!correlation) {
        return (
            <div className="rounded-xl bg-slate-800 p-6">
                Select a dataset to view correlation.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="mb-6 text-xl font-bold">
                Correlation Matrix
            </h2>

            <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>
                        <tr>
                            <th></th>

                            {correlation.columns.map((column) => (
                                <th
                                    key={column}
                                    className="border border-slate-700 p-2"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>

                        {correlation.matrix.map((row, rowIndex) => (

                            <tr key={rowIndex}>

                                <td className="border border-slate-700 p-2 font-semibold">
                                    {correlation.columns[rowIndex]}
                                </td>

                                {row.map((value, columnIndex) => (

                                    <td
                                        key={columnIndex}
                                        className="border border-slate-700 p-2 text-center"
                                    >
                                        {value}
                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}