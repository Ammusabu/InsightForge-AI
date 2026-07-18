import type { DatasetDetail } from "../../types/datasetDetail";

interface Props {
    dataset: DatasetDetail | null;
}

export default function DatasetPreview({
    dataset,
}: Props) {

    if (!dataset) {
        return (
            <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
                Select a dataset from the sidebar.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg">

            <h2 className="text-xl font-bold">
                {dataset.filename}
            </h2>

            <p className="mt-2 text-slate-400">
                {dataset.profile.rows} rows • {dataset.profile.columns} columns
            </p>

            <div className="mt-6 overflow-x-auto">

                <table className="min-w-full text-sm">

                    <thead>

                        <tr>

                            {dataset.columns.map((column) => (
                                <th
                                    key={column}
                                    className="border-b border-slate-700 px-4 py-2 text-left"
                                >
                                    {column}
                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {dataset.preview.map((row, index) => (

                            <tr key={index}>

                                {dataset.columns.map((column) => (

                                    <td
                                        key={column}
                                        className="border-b border-slate-700 px-4 py-2"
                                    >
                                        {String(row[column] ?? "")}
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