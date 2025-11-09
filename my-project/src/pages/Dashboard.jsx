import React, { useState } from "react";
import RoutesTab from "../tabs/RoutesTab";
import CompareTab from "../tabs/CompareTab";
import BankingTab from "../tabs/BankingTab";
import PoolingTab from "../tabs/PoolingTab";

const SAMPLE_ROUTES = [
  { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 },
];

const TABS = ["Routes", "Compare", "Banking", "Pooling"];

export default function Dashboard() {
  const [active, setActive] = useState("Routes");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Fuel EU Compliance Dashboard</h1>
            <p className="text-sm text-gray-500">Target intensity: <span className="font-medium">89.3368 gCO₂e/MJ</span></p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600">Environment: demo</div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <nav className="flex gap-2 p-3 border-b border-gray-100">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  active === t ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {active === "Routes" && <RoutesTab routes={SAMPLE_ROUTES} />}
            {active === "Compare" && <CompareTab routes={SAMPLE_ROUTES} />}
            {active === "Banking" && <BankingTab routes={SAMPLE_ROUTES} />}
            {active === "Pooling" && <PoolingTab routes={SAMPLE_ROUTES} />}
          </div>
        </div>
      </div>
    </div>
  );
}
