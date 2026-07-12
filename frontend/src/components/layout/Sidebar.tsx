import { useEffect, useState } from "react";

import DatasetItem from "../dashboard/DatasetItem";
import { getDatasets } from "../../services/datasetService";

interface Dataset {
  dataset_id: string;
  filename: string;
}

export default function Sidebar() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await getDatasets();
        setDatasets(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  return (
    <aside className="w-72 border-r border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Datasets
      </h2>

      <button
        className="
        mb-6
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

      <div className="space-y-3">
        {datasets.map((dataset) => (
          <DatasetItem
            key={dataset.dataset_id}
            name={dataset.filename}
          />
        ))}
      </div>
    </aside>
  );
}