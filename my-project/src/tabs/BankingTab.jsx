import React, { useMemo, useState } from "react";

/*
  Compliance Balance (CB) formula (mock simplified for UI demo):
  CB = (Target - Actual) * fuelConsumption * 41000 (MJ/t)
  For demo we compute for one ship (first route).
*/

const TARGET = 89.3368;
const MJ_PER_T = 41000;

export default function BankingTab({ routes = [] }) {
  const route = routes[0] || null;
  const [banked, setBanked] = useState(0);
  const [applied, setApplied] = useState(0);

  const cbBefore = useMemo(() => {
    if (!route) return 0;
    return (TARGET - route.ghgIntensity) * (route.fuelConsumption * MJ_PER_T) ;
  }, [route]);

  const cbAfterBank = cbBefore + banked - applied;

  function onBank() {
    if (cbBefore <= 0) {
      alert("No positive CB to bank");
      return;
    }
    const amount = Math.round(cbBefore); // mock
    setBanked(prev => prev + amount);
    alert(`Banked ${amount.toFixed ? amount.toFixed(0) : amount} gCO2-eq (mock)`);
  }

  function onApply() {
    if (banked <= 0) {
      alert("No banked surplus available");
      return;
    }
    const amount = Math.min(banked, Math.abs(cbBefore)); // mock apply
    setApplied(prev => prev + amount);
    setBanked(prev => prev - amount);
    alert(`Applied ${amount.toFixed(0)} gCO2-eq (mock)`);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Banking (Article 20) — Ship: {route?.routeId || "—"}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">CB Before</div>
          <div className="text-2xl font-semibold">{Math.round(cbBefore).toLocaleString()} gCO₂e</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Banked</div>
          <div className="text-2xl font-semibold">{Math.round(banked).toLocaleString()} gCO₂e</div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">CB After</div>
          <div className="text-2xl font-semibold">{Math.round(cbAfterBank).toLocaleString()} gCO₂e</div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onBank}
          disabled={cbBefore <= 0}
          className={`px-4 py-2 rounded ${cbBefore > 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          Bank positive CB
        </button>

        <button
          onClick={onApply}
          disabled={banked <= 0}
          className={`px-4 py-2 rounded ${banked > 0 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          Apply banked surplus
        </button>
      </div>
    </div>
  );
}
