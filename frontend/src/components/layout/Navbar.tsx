import {
    Bell,
    Search,
    Settings,
} from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">

            {/* Left */}

            <div>

                <h1 className="text-2xl font-bold text-white">
                Tourism Analytics Dashboard
                </h1>

                <p className="text-sm text-slate-400">
                    AI Powered Analytics Platform
                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">

                    <Search
                        size={18}
                        className="text-slate-300"
                    />

                </button>

                <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">

                    <Bell
                        size={18}
                        className="text-slate-300"
                    />

                </button>

                <button className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800">

                    <Settings
                        size={18}
                        className="text-slate-300"
                    />

                </button>

                <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        A
                    </div>

                    <div>

                        <p className="font-semibold text-white">
                            Ammu
                        </p>

                        <p className="text-xs text-slate-400">
                            AI Engineer
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}