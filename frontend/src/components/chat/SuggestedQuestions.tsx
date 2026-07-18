interface Props {
    onSelect: (question: string) => void;
}

const questions = [
    "Summarize this dataset",
    "Find anomalies",
    "Explain trends",
    "Generate business insights",
];

export default function SuggestedQuestions({
    onSelect,
}: Props) {

    return (

        <div className="flex flex-wrap gap-2">

            {questions.map((q) => (

                <button
                    key={q}
                    onClick={() => onSelect(q)}
                    className="rounded-full bg-slate-700 px-4 py-2 text-sm hover:bg-blue-600"
                >
                    {q}
                </button>

            ))}

        </div>

    );

}