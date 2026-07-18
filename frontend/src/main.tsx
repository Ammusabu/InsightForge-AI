import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { DatasetProvider } from "./context/DatasetContext";
import { FilterProvider } from "./context/FilterContext";

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>

        <DatasetProvider>

            <FilterProvider>

                <App />

            </FilterProvider>

        </DatasetProvider>

    </React.StrictMode>
);