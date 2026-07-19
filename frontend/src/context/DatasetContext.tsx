import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

interface DatasetContextType {
    selectedDatasetId: string | null;
    setSelectedDatasetId: (id: string | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(
    undefined
);

export function DatasetProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [
        selectedDatasetId,
        setSelectedDatasetId,
    ] = useState<string | null>(null);

    return (
        <DatasetContext.Provider
            value={{
                selectedDatasetId,
                setSelectedDatasetId,
            }}
        >
            {children}
        </DatasetContext.Provider>
    );
}

export function useDataset() {
    const context = useContext(DatasetContext);

    if (!context) {
        throw new Error(
            "useDataset must be used inside DatasetProvider"
        );
    }

    return context;
}