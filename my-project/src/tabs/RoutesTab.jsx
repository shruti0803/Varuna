import React, { useMemo, useState } from "react";

export default function RoutesTab({ routes = [] }) {
  const [vesselFilter, setVesselFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [baseline, setBaseline] = useState(null);

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map(r => r.year))).sort(), [routes]);

  const filtered = routes.filter(r => {
    if (vesselFilter && r.vesselType !== vesselFilter) return false;
    if (fuelFilter && r.fuelType !== fuelFilter) return false;
    if (yearFilter && String(r.year) !== String(yearFilter)) return false;
    return true;
  });

  function setAsBaseline(routeId) {
    // Mock: would call POST /routes/:id/baseline
    setBaseline(routeId);
    alert(`Set ${routeId} as baseline (mock)`);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select value={vesselFilter} onChange={e => setVesselFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All vessel types</option>
          {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All fuel types</option>
          {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <div className="ml-auto text-sm text-gray-600">Showing <span className="font-medium">{filtered.length}</span> routes</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Vessel</th>
              <th className="px-4 py-3">Fuel</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">GHG (gCO₂e/MJ)</th>
              <th className="px-4 py-3">Fuel (t)</th>
              <th className="px-4 py-3">Distance (km)</th>
              <th className="px-4 py-3">Total Emissions (t)</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.routeId} className="border-b last:border-b-0">
                <td className="px-4 py-3">{r.routeId}</td>
                <td className="px-4 py-3">{r.vesselType}</td>
                <td className="px-4 py-3">{r.fuelType}</td>
                <td className="px-4 py-3">{r.year}</td>
                <td className="px-4 py-3">{r.ghgIntensity.toFixed(2)}</td>
                <td className="px-4 py-3">{r.fuelConsumption}</td>
                <td className="px-4 py-3">{r.distance}</td>
                <td className="px-4 py-3">{r.totalEmissions}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setAsBaseline(r.routeId)}
                    className={`px-3 py-1 rounded text-sm ${baseline === r.routeId ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}
                  >
                    {baseline === r.routeId ? "Baseline" : "Set Baseline"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">No routes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
