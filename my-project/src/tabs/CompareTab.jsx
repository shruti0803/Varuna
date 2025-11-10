import React, { useState, useEffect } from "react";

const TARGET = 89.3368;

export default function CompareTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparison() {
      try {
        const res = await fetch("http://localhost:8080/routes/comparison");
        if (!res.ok) throw new Error("Failed to fetch comparison data");
        const json = await res.json();
        console.log("Fetched JSON:", json);
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchComparison();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Loading comparison data...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">
        No data available.
      </div>
    );

  const { baseline: baselineId, comparisons } = data;

  // Sort baseline first
  const chartData = [
    ...comparisons.filter((r) => r.id === baselineId),
    ...comparisons.filter((r) => r.id !== baselineId),
  ];

  // Max value for scaling
  const maxValue = Math.max(...chartData.map((r) => r.ghg_intensity), TARGET);
  const maxValueScaled = maxValue * 1.2; // 20% padding

  const chartHeight = 360; // px for h-96

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
        Baseline vs Comparison
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Table */}
        <div className="p-6 rounded-xl shadow-lg">
          <div className="text-sm font-medium text-gray-500 mb-4">Routes Table</div>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">GHG (gCO₂e/MJ)</th>
                <th className="px-4 py-2">% diff vs baseline</th>
                <th className="px-4 py-2">Compliant</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((r) => (
                <tr key={r.route_id} className="border-b hover:bg-blue-50 transition">
                  <td className="px-4 py-2 font-medium">{r.route_id}</td>
                  <td className="px-4 py-2">{r.ghg_intensity.toFixed(3)}</td>
                  <td className="px-4 py-2">{r.percentDiff.toFixed(2)}%</td>
                  <td className="px-4 py-2">{r.compliant ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg relative">
          <div className="text-sm font-medium text-gray-500 mb-4">GHG Intensity Chart</div>
          <div className="relative flex items-end gap-4 h-[360px] border-t border-gray-200">
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400"
              style={{ bottom: `${(TARGET / maxValueScaled) * chartHeight}px` }}
            />

            {chartData.map((r) => {
              const heightPx = (r.ghg_intensity / maxValueScaled) * chartHeight;
              return (
                <div key={r.route_id} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-10 rounded-t-lg transition-all duration-500 cursor-pointer ${
                      r.id === baselineId
                        ? "bg-blue-500"
                        : r.compliant
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ height: `${Math.max(heightPx, 20)}px` }}
                    title={`${r.route_id}: ${r.ghg_intensity.toFixed(3)} gCO₂e/MJ`}
                  />
                  <div className="text-xs mt-2 font-semibold text-center">{r.route_id}</div>
                  {r.id === baselineId && (
                    <div className="text-xs font-bold text-blue-700">Baseline</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Blue = baseline, Green = compliant, Red = non-compliant. Dashed line = target ({TARGET.toFixed(2)} gCO₂e/MJ)
          </div>
        </div>
      </div>
    </div>
  );
}
