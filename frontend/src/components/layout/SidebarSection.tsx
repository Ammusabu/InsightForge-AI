interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SidebarSection({
    title,
    children,
}: SidebarSectionProps) {
    return (
        <div className="mt-8">

            <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
            </h3>

            <div className="space-y-1">
                {children}
            </div>

        </div>
    );
}