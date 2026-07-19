import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateReportButtonProps {
    onGenerate: () => Promise<void>;
}

export default function GenerateReportButton({
    onGenerate,
}: GenerateReportButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        try {
            setLoading(true);
            await onGenerate();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="
                flex items-center gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-6
                py-3
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:from-blue-700
                hover:to-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-70
            "
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating AI Report...
                </>
            ) : (
                <>
                    <Sparkles size={18} />
                    Generate AI Report
                </>
            )}
        </button>
    );
}