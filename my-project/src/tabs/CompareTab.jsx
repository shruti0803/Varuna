import React, { useState, useEffect } from "react";

const TARGET = 89.3368;

export default function CompareTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await fetch("http://localhost:8080/routes/comparison");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching comparison data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
        Loading comparison data...
      </div>
    );
  if (!data)
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        No data available.
      </div>
    );

  const { baseline, comparisons } = data;
 const maxValue = Math.max(...comparisons.map((r) => Number(r.ghg_intensity) || 0));


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
          Baseline vs Comparison
        </h3>
        <p className="text-gray-600">
          Baseline Route: <span className="font-semibold">{baseline}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* === Table Card === */}
        <div className=" p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <div className="text-sm font-medium text-gray-500 mb-4">Routes Table</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-100 rounded-lg">
                <tr>
                  <th className="px-4 py-2">Route</th>
                  <th className="px-4 py-2">GHG (gCO₂e/MJ)</th>
                  <th className="px-4 py-2">% diff vs baseline</th>
                  <th className="px-4 py-2">Compliant</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((r) => (
                  <tr key={r.route_id} className="border-b last:border-none hover:bg-blue-50 transition">
                    <td className="px-4 py-2 font-medium">{r.route_id}</td>
                    <td className="px-4 py-2">{r.ghg_intensity.toFixed(3)}</td>
                    <td className="px-4 py-2">{r.percentDiff.toFixed(2)}%</td>
                    <td className="px-4 py-2">{r.compliant ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === Bar Chart Card === */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <div className="text-sm font-medium text-gray-500 mb-4">GHG Intensity Chart</div>
          <div className="flex items-end gap-4 h-48">
            {comparisons.map((r) => {
              const height = (r.ghg_intensity / maxValue) * 100;
              return (
                <div key={r.route_id} className="flex-1 flex flex-col items-center">
                 <div
  className={`w-10 rounded-t-lg transition-all duration-500 ${
    r.compliant ? "bg-green-500" : "bg-red-500"
  }`}
  style={{ height: `${Math.max((r.ghg_intensity / maxValue) * 100, 5)}%` }} // min 5%
/>

                  <div className="text-xs mt-2 font-semibold">{r.route_id}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Green bars indicate ≤ {TARGET} gCO₂e/MJ
          </div>
        </div>
      </div>
    </div>
  );
}
