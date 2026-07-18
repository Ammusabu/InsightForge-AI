import ReactMarkdown from "react-markdown";

import type { ChatMessage } from "../../types/chat";

interface Props {
    message: ChatMessage;
}

export default function MessageBubble({
    message,
}: Props) {

    const isUser =
        message.role === "user";

    return (

        <div
            className={`flex ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            <div
                className={`
                    max-w-[80%]
                    rounded-2xl
                    px-5
                    py-4
                    leading-7
                    shadow-lg
                    ${
                        isUser
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-100"
                    }
                `}
            >

                {isUser ? (
                    message.content
                ) : (
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}

            </div>

        </div>

    );

}