interface ChatHeaderProps {
    onNewChat: () => void;
}

export default function ChatHeader({
    onNewChat,
}: ChatHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">

            <div>

                <h2 className="text-2xl font-bold text-white">
                    🤖 InsightForge Copilot
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Ask questions, discover insights, and analyze your dataset with AI.
                </p>

            </div>

            <button
                onClick={onNewChat}
                className="
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                "
            >
                + New Chat
            </button>

        </div>
    );
}