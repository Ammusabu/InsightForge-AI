interface Props {
    onClick: () => void;
}

export default function FloatingChatButton({
    onClick,
}: Props) {

    return (

        <button
            onClick={onClick}
            className="
                fixed
                bottom-8
                right-8
                z-50
                h-16
                w-16
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-3xl
                shadow-2xl
                transition-all
                duration-300
                hover:scale-110
                hover:shadow-blue-500/50
            "
        >
            🤖
        </button>

    );

}