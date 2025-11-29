import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    api.get(`/responses/${formId}`).then((res) => {
      setResponses(res.data || []);
    });
  }, [formId]);

  if (responses.length === 0) {
    return <p className="p-6 text-gray-600">No submissions yet.</p>;
  }

  const allKeys = Array.from(
    new Set(responses.flatMap((r) => Object.keys(r.answers || {})))
  );

  const downloadCSV = () => {
    let csv = "";
    csv += `Index,Submitted At,${allKeys.join(",")},Status\n`;

    responses.forEach((res, index) => {
      const row = [
        index + 1,
        new Date(res.createdAt).toLocaleString(),
        ...allKeys.map((k) => {
          let value = res.answers?.[k];
          return Array.isArray(value)
            ? `"${value.join("; ")}"`
            : `"${value || ""}"`;
        }),
        res.deletedInAirtable ? "Deleted" : "Active",
      ];
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form_${formId}_responses.csv`;
    link.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Submitted Responses</h2>

        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Submitted At</th>

              {allKeys.map((key) => (
                <th key={key} className="border p-2">
                  {key}
                </th>
              ))}

              <th className="border p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {responses.map((res, index) => (
              <tr
                key={res._id}
                className={res.deletedInAirtable ? "bg-red-100" : "bg-white"}
              >
                <td className="border p-2 text-center">{index + 1}</td>

                <td className="border p-2">
                  {new Date(res.createdAt).toLocaleString()}
                </td>

                {allKeys.map((key) => (
                  <td key={key} className="border p-2">
                    {Array.isArray(res.answers[key])
                      ? res.answers[key].join(", ")
                      : res.answers[key] || "-"}
                  </td>
                ))}

                <td className="border p-2 text-center">
                  {res.deletedInAirtable ? "Deleted" : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
