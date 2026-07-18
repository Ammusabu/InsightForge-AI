import { useRef } from "react";

interface UploadButtonProps {
  onSelect(file: File): void;
}

export default function UploadButton({
  onSelect,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".csv"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onSelect(file);
          }
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="
          w-full
          rounded-lg
          bg-blue-600
          py-3
          font-medium
          hover:bg-blue-500
        "
      >
        + Upload Dataset
      </button>
    </>
  );
}