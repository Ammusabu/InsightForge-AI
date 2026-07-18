import { useEffect, useRef, useState } from "react";

import { askAI } from "../../services/chatService";
import { useDataset } from "../../context/DatasetContext";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import SuggestedQuestions from "./SuggestedQuestions";
import TypingIndicator from "./TypingIndicator";

import type { ChatMessage } from "../../types/chat";

export default function ChatPanel() {

    const { selectedDatasetId } = useDataset();

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [question, setQuestion] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const bottomRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, loading]);

    function handleNewChat() {

        setMessages([]);
        setQuestion("");

    }

    async function sendQuestion(
        customQuestion?: string
    ) {

        const text =
            customQuestion ?? question;

        if (
            !selectedDatasetId ||
            !text.trim()
        ) {
            return;
        }

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: "user",
            content: text,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setQuestion("");

        setLoading(true);

        try {

            const answer =
                await askAI(
                    selectedDatasetId,
                    text
                );

            const aiMessage: ChatMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: answer,
            };

            setMessages((prev) => [
                ...prev,
                aiMessage,
            ]);

        } catch {

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    role: "assistant",
                    content:
                        "Something went wrong.",
                },
            ]);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">

            <ChatHeader
                onNewChat={handleNewChat}
            />

            <SuggestedQuestions
                onSelect={sendQuestion}
            />

            <div
                className="
                    mt-6
                    h-96
                    space-y-4
                    overflow-y-auto
                    rounded-xl
                    bg-slate-900
                    p-4
                "
            >

                {messages.map((message) => (

                    <MessageBubble
                        key={message.id}
                        message={message}
                    />

                ))}

                {loading && (
                    <TypingIndicator />
                )}

                <div ref={bottomRef} />

            </div>

            <div className="mt-6 flex gap-3">

                <input
                    value={question}
                    onChange={(e) =>
                        setQuestion(
                            e.target.value
                        )
                    }
                    placeholder="Ask anything about your dataset..."
                    className="
                        flex-1
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900
                        px-4
                        py-3
                        text-white
                        placeholder:text-slate-500
                        focus:border-blue-500
                        focus:outline-none
                    "
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter"
                        ) {
                            sendQuestion();
                        }

                    }}
                />

                <button
                    onClick={() =>
                        sendQuestion()
                    }
                    disabled={loading}
                    className="
                        rounded-xl
                        bg-blue-600
                        px-6
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Send
                </button>

            </div>

        </div>

    );

}