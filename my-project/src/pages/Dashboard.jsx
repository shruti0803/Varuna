// Dashboard.jsx
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

export default function Dashboard({ activeTab }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 animate-fadeInUp">
      {activeTab === "Routes" && <RoutesTab routes={SAMPLE_ROUTES} />}
      {activeTab === "Compare" && <CompareTab routes={SAMPLE_ROUTES} />}
      {activeTab === "Banking" && <BankingTab routes={SAMPLE_ROUTES} />}
      {activeTab === "Pooling" && <PoolingTab routes={SAMPLE_ROUTES} />}
    </div>
  );
}

