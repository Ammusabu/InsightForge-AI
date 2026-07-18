import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <div className="flex h-screen bg-slate-950">

            {/* Sidebar */}

            <Sidebar />

            {/* Right Side */}

            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Top Navbar */}

                <Navbar />

                {/* Page Content */}

                <main className="flex-1 overflow-y-auto">

                    <div className="p-8">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}