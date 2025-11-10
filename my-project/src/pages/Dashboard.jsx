// Dashboard.jsx
import React, { useState, useEffect } from "react";
import RoutesTab from "../tabs/RoutesTab";
import CompareTab from "../tabs/CompareTab";
import BankingTab from "../tabs/BankingTab";
import PoolingTab from "../tabs/PoolingTab";

const SAMPLE_ROUTES = [
  { routeId: "1", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: "2", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { routeId: "3", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { routeId: "4", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { routeId: "5", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 },
];

export default function Dashboard({ activeTab }) {
  const [baselineId, setBaselineId] = useState(null);

  // Load baseline from localStorage
  useEffect(() => {
    const storedBaseline = localStorage.getItem("baselineId");
    if (storedBaseline) {
      setBaselineId(storedBaseline);
      console.log("Loaded baseline from localStorage:", storedBaseline);
    }
  }, []);

  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 animate-fadeInUp">
      {activeTab === "Routes" && <RoutesTab routes={SAMPLE_ROUTES} baselineId={baselineId} />}
      {activeTab === "Compare" && <CompareTab routes={SAMPLE_ROUTES} baselineId={baselineId} />}
      {activeTab === "Banking" && <BankingTab routes={SAMPLE_ROUTES} baselineId={baselineId} />}
      {activeTab === "Pooling" && <PoolingTab routes={SAMPLE_ROUTES} baselineId={baselineId} />}
    </div>
  );
}
