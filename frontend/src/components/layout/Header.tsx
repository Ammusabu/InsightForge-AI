export default function Header() {
    return (
        <header className="h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-8">
            <div>
                <h1 className="text-xl font-bold">
                    InsightForge AI
                </h1>

                <p className="text-sm text-slate-400">
                    AI-Powered Business Intelligence
                </p>
            </div>

            <div className="text-sm text-slate-400">
                Version 0.1
            </div>
        </header>
    );
}