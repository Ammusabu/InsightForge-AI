import type { ReactNode } from "react";

import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-slate-950 text-white">

            <Sidebar />

            <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
                {children}
            </main>

        </div>
    );
}