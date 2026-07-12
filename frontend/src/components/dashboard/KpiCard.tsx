interface KpiCardProps {
    title: string;
    value: string | number;
  }
  
  export default function KpiCard({
    title,
    value,
  }: KpiCardProps) {
    return (
      <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
        <p className="text-sm text-slate-400">{title}</p>
  
        <h2 className="mt-3 text-4xl font-bold text-white">
          {value}
        </h2>
      </div>
    );
  }