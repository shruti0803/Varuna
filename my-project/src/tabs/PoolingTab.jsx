import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PoolingTab() {
  const [ships, setShips] = useState([]);
  const [selected, setSelected] = useState([]);
  const [poolSum, setPoolSum] = useState(0);
  const [result, setResult] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchShips() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/compliance/adjusted-cb?year=${year}`);
        const shipsData = res.data.map((s) => ({
          shipId: s.id,
          name: s.name,
          cbBefore: s.adjustedCB,
        }));
        setShips(shipsData);
        setSelected(shipsData.map((s) => s.shipId));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load adjusted CBs:", err);
        setLoading(false);
      }
    }
    fetchShips();
  }, [year]);

  useEffect(() => {
    const selectedShips = ships.filter((s) => selected.includes(s.shipId));
    const total = selectedShips.reduce((sum, s) => sum + s.cbBefore, 0);
    setPoolSum(total);
  }, [selected, ships]);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setResult(null);
  }

  async function createPool() {
    if (poolSum < 0) {
      alert("Pool invalid: total adjusted CB is negative");
      return;
    }
    try {
      const res = await axios.post("/api/pools", { members: selected });
      setResult(res.data);
      alert("✅ Pool created successfully!");
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Failed to create pool"));
    }
  }

  if (loading)
    return <div className="text-center py-20 text-gray-500 animate-pulse">Loading adjusted CBs...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Pooling (Article 21)</h3>
        <p className="text-gray-600">Select pool members and create a shared CB pool</p>
      </div>

      {/* Member Selection */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-500">Select Pool Members</div>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Year"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {ships.map((s) => (
            <label
              key={s.shipId}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition hover:shadow-md bg-white"
            >
              <input
                type="checkbox"
                checked={selected.includes(s.shipId)}
                onChange={() => toggle(s.shipId)}
                className="accent-blue-500 w-4 h-4"
              />
              <span className="font-medium">{s.name || s.shipId}</span>
              <span
                className={`ml-2 text-xs font-semibold ${
                  s.cbBefore >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.round(s.cbBefore).toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Pool Sum */}
      <div className="inline-block px-4 py-2 rounded-xl bg-gray-100 shadow-inner">
        Pool Sum:{" "}
        <span className={poolSum >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {Math.round(poolSum).toLocaleString()}
        </span>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={createPool}
          disabled={selected.length === 0 || poolSum < 0}
          className={`px-6 py-3 rounded-xl font-semibold shadow-lg text-white transition transform hover:scale-105 ${
            poolSum >= 0 ? "bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Create Pool
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="text-sm text-gray-500 mb-2">Pool Created Successfully</div>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Total CB:</span> {Math.round(result.totalCB).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Members:</span> {result.members.map((m) => m.name || m.id).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
