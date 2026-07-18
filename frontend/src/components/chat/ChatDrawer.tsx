import ChatPanel from "./ChatPanel";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ChatDrawer({
    open,
    onClose,
}: Props) {

    return (

        <>

            {open && (

                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                    "
                    onClick={onClose}
                />

            )}

            <div
                className={`
                    fixed
                    top-0
                    right-0
                    z-50
                    h-screen
                    w-[420px]
                    bg-slate-900
                    border-l
                    border-slate-700
                    shadow-2xl
                    transition-transform
                    duration-300

                    ${open
                        ? "translate-x-0"
                        : "translate-x-full"}
                `}
            >

                <ChatPanel />

            </div>

        </>

    );

}