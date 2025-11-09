import React, { useMemo, useState } from "react";

/*
  Pooling rules (demo):
   - Sum(adjustedCB) >= 0
   - Deficit ship cannot exit worse
   - Surplus ship cannot exit negative
  Implementation below uses given sample routes and computes CB per ship (mock).
*/

const TARGET = 89.3368;
const MJ_PER_T = 41000;

function computeCB(route) {
  return (TARGET - route.ghgIntensity) * (route.fuelConsumption * MJ_PER_T);
}

export default function PoolingTab({ routes = [] }) {
  const ships = routes.map(r => ({ shipId: r.routeId, cbBefore: computeCB(r) }));
  const [selected, setSelected] = useState(ships.map(s => s.shipId)); // by default all members
  const [result, setResult] = useState(null);

  const members = ships.filter(s => selected.includes(s.shipId));
  const poolSum = members.reduce((s, m) => s + m.cbBefore, 0);

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setResult(null);
  }

  function createPool() {
    // Validation
    if (poolSum < 0) {
      alert("Pool invalid: total adjusted CB is negative");
      return;
    }
    // Greedy allocation: give surplus to deficits
    const sorted = [...members].sort((a,b) => b.cbBefore - a.cbBefore);
    const deficits = sorted.filter(s => s.cbBefore < 0).map(s => ({...s}));
    const surplus = sorted.filter(s => s.cbBefore > 0).map(s => ({...s}));

    const after = members.map(m => ({ shipId: m.shipId, cbBefore: m.cbBefore, cbAfter: m.cbBefore }));

    // Transfer from largest surplus to largest deficit
    let surIdx = 0;
    for (let d of deficits) {
      let needed = -d.cbBefore;
      while (needed > 0 && surIdx < surplus.length) {
        const s = surplus[surIdx];
        const give = Math.min(s.cbBefore, needed);
        // apply
        after.find(a => a.shipId === s.shipId).cbAfter -= give;
        after.find(a => a.shipId === d.shipId).cbAfter += give;
        s.cbBefore -= give;
        needed -= give;
        if (s.cbBefore <= 0) surIdx++;
      }
      if (needed > 1e-6) {
        // cannot fully cover deficit
      }
    }
    setResult({ after, poolSum });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pooling (Article 21)</h3>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="text-sm text-gray-500 mb-2">Select pool members</div>
        <div className="flex flex-wrap gap-3">
          {ships.map(s => (
            <label key={s.shipId} className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
              <input type="checkbox" checked={selected.includes(s.shipId)} onChange={() => toggle(s.shipId)} />
              <span className="font-medium">{s.shipId}</span>
              <span className={`ml-2 text-xs ${s.cbBefore >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.round(s.cbBefore).toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="inline-block px-3 py-2 rounded bg-gray-100">Pool Sum: <span className={poolSum >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{Math.round(poolSum).toLocaleString()}</span></div>
      </div>

      <div className="flex gap-3">
        <button onClick={createPool} disabled={selected.length === 0 || poolSum < 0} className={`px-4 py-2 rounded ${poolSum >= 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
          Create Pool
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500 mb-3">Allocation Result</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">Ship</th>
                <th className="px-3 py-2">CB Before</th>
                <th className="px-3 py-2">CB After</th>
              </tr>
            </thead>
            <tbody>
              {result.after.map(a => (
                <tr key={a.shipId} className="border-b">
                  <td className="px-3 py-2">{a.shipId}</td>
                  <td className="px-3 py-2">{Math.round(a.cbBefore).toLocaleString()}</td>
                  <td className="px-3 py-2">{Math.round(a.cbAfter).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
