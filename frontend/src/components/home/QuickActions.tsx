export default function QuickActions() {

    return (

        <div className="rounded-2xl bg-slate-800 p-6">

            <h2 className="mb-5 text-xl font-bold">
                Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <button className="rounded-lg bg-blue-600 p-4 hover:bg-blue-700">
                    Upload Dataset
                </button>

                <button className="rounded-lg bg-green-600 p-4 hover:bg-green-700">
                    AI Report
                </button>

                <button className="rounded-lg bg-purple-600 p-4 hover:bg-purple-700">
                    Forecast
                </button>

                <button className="rounded-lg bg-orange-600 p-4 hover:bg-orange-700">
                    Ask AI
                </button>

            </div>

        </div>

    );
}