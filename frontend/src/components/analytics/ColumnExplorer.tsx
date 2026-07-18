import type { AnalyticsOverview } from "../../types/analytics";

interface Props {
    analytics: AnalyticsOverview;
}

export default function ColumnExplorer({
    analytics,
}: Props) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                📋 Column Explorer
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="border-b border-slate-700">

                        <th className="pb-3 text-left text-slate-400">
                            Column
                        </th>

                        <th className="pb-3 text-left text-slate-400">
                            Type
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {analytics.numeric_columns.map((column) => (

                        <tr
                            key={column}
                            className="border-b border-slate-800"
                        >

                            <td className="py-3 text-white">
                                {column}
                            </td>

                            <td className="text-blue-400">
                                Numeric
                            </td>

                        </tr>

                    ))}

                    {analytics.categorical_columns.map((column) => (

                        <tr
                            key={column}
                            className="border-b border-slate-800"
                        >

                            <td className="py-3 text-white">
                                {column}
                            </td>

                            <td className="text-green-400">
                                Category
                            </td>

                        </tr>

                    ))}

                    {analytics.datetime_columns.map((column) => (

                        <tr
                            key={column}
                            className="border-b border-slate-800"
                        >

                            <td className="py-3 text-white">
                                {column}
                            </td>

                            <td className="text-purple-400">
                                Datetime
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}