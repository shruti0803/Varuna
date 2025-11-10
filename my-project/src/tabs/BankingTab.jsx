import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
// 89.3368;
const TARGET = 89.3368;
const MJ_PER_T = 41000;

export default function BankingTab({ baselineId }) {
  const shipId = baselineId;   // baselineId = shipId
  const year = 2025;           // default or fixed year
  const [banked, setBanked] = useState(0);
  const [applied, setApplied] = useState(0);
  const [records, setRecords] = useState([]);
  const [ghgIntensity, setGhgIntensity] = useState(90); // Example default GHG intensity
  const [fuelConsumption, setFuelConsumption] = useState(5000); // Example default fuel consumption

  // Fetch banking records
  useEffect(() => {
    if (!shipId) return;
    axios
      .get(`http://localhost:8080/banking/records?shipId=${shipId}&year=${year}`)
      .then(res => setRecords(res.data))
      .catch(err => console.error("Error fetching records:", err));
  }, [shipId, year]);

  const cbBefore = useMemo(() => {
    return (TARGET - ghgIntensity) * (fuelConsumption || 1) * MJ_PER_T;
  }, [ghgIntensity, fuelConsumption]);

  const cbAfterBank = cbBefore + banked - applied;

  async function onBank() {
    if (cbBefore <= 0) return alert("No positive CB to bank");
    const amount = Math.round(cbBefore);
    try {
      const res = await axios.post("http://localhost:8080/banking/bank", { shipId, year, amount });
      setBanked(prev => prev + res.data.amount);
      alert(`✅ Banked ${amount} gCO₂e successfully`);
    } catch (err) {
      console.error(err);
      alert("Failed to bank surplus");
    }
  }

  async function onApply() {
    if (banked <= 0) return alert("No banked surplus available");
    const amount = Math.min(banked, Math.abs(cbBefore));
    try {
      const res = await axios.post("http://localhost:8080/banking/apply", { shipId, year, amount });
      setApplied(prev => prev + res.data.applied);
      setBanked(prev => prev - res.data.applied);
      alert(`✅ Applied ${amount} gCO₂e successfully`);
    } catch (err) {
      console.error(err);
      alert("Failed to apply surplus");
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-extrabold text-gray-900">Banking (Article 20)</h3>
      <p className="text-gray-600">Ship: <span className="font-semibold">{shipId || "—"}</span></p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-lg">
          <div className="text-sm font-medium text-gray-500">CB Before</div>
          <div className="text-3xl font-bold text-blue-600">{Math.round(cbBefore).toLocaleString()} gCO₂e</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl shadow-lg">
          <div className="text-sm font-medium text-gray-500">Banked</div>
          <div className="text-3xl font-bold text-green-600">{Math.round(banked).toLocaleString()} gCO₂e</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl shadow-lg">
          <div className="text-sm font-medium text-gray-500">CB After</div>
          <div className="text-3xl font-bold text-purple-600">{Math.round(cbAfterBank).toLocaleString()} gCO₂e</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <button
          onClick={onBank}
          disabled={cbBefore <= 0}
          className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg ${
            cbBefore > 0 ? "bg-gradient-to-r from-blue-500 to-teal-400" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Bank Positive CB
        </button>
        <button
          onClick={onApply}
          disabled={banked <= 0}
          className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg ${
            banked > 0 ? "bg-gradient-to-r from-green-500 to-teal-400" : "bg-gray-300 "
          }`}
        >
          Apply Banked Surplus
        </button>
      </div>

      {records.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-3">Previous Records</h4>
          <ul className="divide-y divide-gray-200">
            {records.map((r, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span className="font-medium">{r.year}</span>
                <span>{r.amount.toLocaleString()} gCO₂e</span>
                <span className="text-gray-500">{r.type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
