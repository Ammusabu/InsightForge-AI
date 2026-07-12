interface DatasetItemProps {
    name: string;
  }
  
  export default function DatasetItem({
    name,
  }: DatasetItemProps) {
    return (
      <button
        className="
        w-full
        rounded-lg
        bg-slate-800
        hover:bg-slate-700
        px-4
        py-3
        text-left
        transition
        "
      >
        📄 {name}
      </button>
    );
  }