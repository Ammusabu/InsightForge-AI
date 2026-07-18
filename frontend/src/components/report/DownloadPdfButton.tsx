interface Props {
    onDownload: () => void;
}

export default function DownloadPdfButton({
    onDownload,
}: Props) {
    return (
        <button
            onClick={onDownload}
            className="
                rounded-lg
                bg-green-600
                px-5
                py-3
                text-white
                transition
                hover:bg-green-700
            "
        >
            Download PDF
        </button>
    );
}