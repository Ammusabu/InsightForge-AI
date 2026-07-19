import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Forecast from "./pages/Forecast";
import PowerBI from "./pages/PowerBI";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />
                <Route
                    path="/analytics"
                    element={<Analytics />}
                />  
                <Route
                    path="/reports"
                    element={<Reports />}
                />
                <Route
                    path="/forecast"
                     element={<Forecast />}
                />
                <Route path="/powerbi" element={<PowerBI />} />
            </Routes>
        </BrowserRouter>
    );
}