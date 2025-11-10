import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RoutesTab() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [baseline, setBaseline] = useState(null);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/routes");
      if (!res.ok) throw new Error("Failed to fetch routes");
      const data = await res.json();
      setRoutes(data);
      const currentBaseline = data.find(r => r.is_baseline);
      setBaseline(currentBaseline?.id || null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const years = useMemo(
    () => Array.from(new Set(routes.map((r) => r.year))).sort(),
    [routes]
  );

  const filtered = routes.filter((r) =>
    yearFilter ? String(r.year) === String(yearFilter) : true
  );

  async function setAsBaseline(routeId) {
    try {
      console.log("routeId",routeId);
      
      setLoading(true);
      const res = await fetch(`http://localhost:8080/routes/${routeId}/baseline`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to set baseline");
      }
      setBaseline(routeId);
        if (routeId) {
        localStorage.setItem("baselineId", routeId);
        console.log("Saved baseline to localStorage:", routeId);
      }
      toast.success("✅ Baseline updated successfully");
      await fetchRoutes();
    } catch (err) {
      console.error(err);
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="text-center py-20 text-gray-500 animate-pulse">Loading routes...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">All Routes</h2>
        <p className="text-gray-600">View and manage all routes and their baseline status</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <div className="ml-auto text-sm text-gray-500">
          Showing <span className="font-medium">{filtered.length}</span> routes
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-2xl transition">
        <table className="min-w-full text-left text-sm divide-y divide-gray-200">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-3 text-gray-700">Route</th>
              <th className="px-4 py-3 text-gray-700">Year</th>
              <th className="px-4 py-3 text-gray-700">GHG (gCO₂e/MJ)</th>
              <th className="px-4 py-3 text-gray-700">Baseline</th>
              <th className="px-4 py-3 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className={`bg-white hover:bg-blue-50 transition ${baseline === r.id ? "ring-2 ring-green-400" : ""}`}>
                <td className="px-4 py-3 font-medium">{r.route_id}</td>
                <td className="px-4 py-3">{r.year}</td>
                <td className="px-4 py-3">{r.ghg_intensity.toFixed(3)}</td>
                <td className="px-4 py-3">{r.is_baseline ? "✅" : "❌"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setAsBaseline(r.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition transform hover:scale-105 ${
                      baseline === r.id
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {baseline === r.id ? "Baseline" : "Set Baseline"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No routes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
