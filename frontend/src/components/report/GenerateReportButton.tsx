import { useState } from "react";

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
                rounded-lg
                bg-blue-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >
            {loading
                ? "Generating..."
                : "Generate AI Report"}
        </button>
    );
}