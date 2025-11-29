import { useEffect, useState } from "react";
import api from "../api";

export default function SelectTable() {
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    api.get("/airtable/bases")
      .then((res) => setBases(res.data?.bases || []))
      .catch(() => setBases([]));
  }, []);

  const loadTables = async (baseId) => {
    localStorage.setItem("selectedBase", baseId);

    try {
      const res = await api.get(`/airtable/bases/${baseId}/tables`);
      setTables(res.data?.tables || []); 
    } catch (err) {
      console.error(err);
      setTables([]); // fallback
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-semibold text-xl mb-4">Select an Airtable Base</h2>

      <select className="border p-2" onChange={(e) => loadTables(e.target.value)}>
        <option>Select Base...</option>
        {bases.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      {tables.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg mb-2 font-semibold">Select Table</h3>
          {tables.map((t) => (
            <button
              key={t.id}
              className="block border p-2 my-2 w-full text-left"
              onClick={() => {
                localStorage.setItem("selectedTable", JSON.stringify(t));
                window.location.href = "/builder";
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
