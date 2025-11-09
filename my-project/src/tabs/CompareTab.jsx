import React, { useMemo, useState } from "react";

/*
  percentDiff = ((comparison / baseline) − 1) × 100
  target is 89.3368 gCO2e/MJ but for compare we compute percent difference baseline->comparison
*/

const TARGET = 89.3368;

export default function CompareTab({ routes = [] }) {
  // pick a baseline (first route) – in real app we'd fetch baseline route explicitly
  const baseline = routes[0] || null;
  const comparison = routes.slice(1);

  function percentDiff(comp, base) {
    if (!base || base === 0) return 0;
    return ((comp / base) - 1) * 100;
  }

  // simple chart bars data
  const chartData = useMemo(() => {
    return routes.map(r => ({ id: r.routeId, value: r.ghgIntensity }));
  }, [routes]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Baseline vs Comparison</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500 mb-2">Table</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">GHG (gCO₂e/MJ)</th>
                <th className="px-3 py-2">% diff vs baseline</th>
                <th className="px-3 py-2">Compliant</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(r => {
                const pd = baseline ? percentDiff(r.ghgIntensity, baseline.ghgIntensity) : 0;
                const compliant = r.ghgIntensity <= TARGET;
                return (
                  <tr key={r.routeId} className="border-b">
                    <td className="px-3 py-2">{r.routeId}</td>
                    <td className="px-3 py-2">{r.ghgIntensity.toFixed(3)}</td>
                    <td className="px-3 py-2">{pd.toFixed(2)}%</td>
                    <td className="px-3 py-2">{compliant ? "✅" : "❌"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Simple inline chart (no external libs) */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500 mb-2">GHG Intensity Chart</div>
          <div className="flex items-end gap-3 h-48">
            {chartData.map(d => {
              // scale bars to range visually
              const max = Math.max(...chartData.map(x => x.value)) || 1;
              const height = Math.max(6, (d.value / max) * 100);
              return (
                <div key={d.id} className="flex-1 flex flex-col items-center">
                  <div className={`w-10 rounded-t ${d.value <= TARGET ? "bg-green-500" : "bg-red-500"}`} style={{ height: `${height}%` }} />
                  <div className="text-xs mt-2">{d.id}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-500">Green bars indicate ≤ {TARGET} gCO₂e/MJ</div>
        </div>
      </div>
    </div>
  );
}
