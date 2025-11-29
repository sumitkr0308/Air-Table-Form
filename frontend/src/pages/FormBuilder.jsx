import { useEffect, useState } from "react";
import api from "../api";

export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const baseId = localStorage.getItem("selectedBase");
  const table = JSON.parse(localStorage.getItem("selectedTable"));


  useEffect(() => {
    if (!baseId || !table) return;

    api
      .get(`/airtable/bases/${baseId}/tables/${table.id}/fields`)
      .then((res) => {
        console.log("Fields Loaded:", res.data);
        setFields(res.data.fields || []);
      })
      .catch((err) => console.error("Error loading fields:", err));
  }, [baseId, table]);

  const mapFieldType = (type) => {
    switch (type) {
      case "singleLineText":
        return "shortText";
      case "multilineText":
        return "longText";
      case "multipleSelects":
        return "multiSelect";
      case "multipleAttachments":
        return "attachment";
      default:
        return type; 
    }
  };

  const toggleField = (field) => {
    const exists = selectedFields.find((f) => f.id === field.id);

    if (exists) {
      setSelectedFields(selectedFields.filter((f) => f.id !== field.id));
    } else {
      setSelectedFields([...selectedFields, { ...field, required: false }]);
    }
  };

  // Save form to backend
  const saveForm = async () => {
    const payload = {
      name: `${table.name} Form`,
      airtableBaseId: baseId,
      airtableTableId: table.id,
      airtableTableName: table.name,
      questions: selectedFields.map((f) => ({
        questionKey: f.id,
        label: f.name,
        airtableFieldId: f.id,
        type: mapFieldType(f.type),
        required: f.required || false,
        conditionalRules: null,
      })),
    };

    console.log("📤 Saving Form Payload:", payload);

    try {
      const res = await api.post("/forms", payload);
      alert("Form saved successfully!");
      window.location.href = `/form/${res.data._id}`;
    } catch (error) {
      console.error("Form Save Error:", error.response?.data || error);
      alert("Failed to save form. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Build Form</h2>
      <p className="mb-4">
        Table: <strong>{table?.name}</strong>
      </p>

      <h3 className="font-semibold mb-2">Available Fields</h3>

      {fields.length === 0 && <p className="text-gray-500">Loading fields...</p>}

      {fields.map((field) => (
        <label key={field.id} className="block border p-2 rounded my-2">
          <input
            type="checkbox"
            checked={!!selectedFields.find((f) => f.id === field.id)}
            onChange={() => toggleField(field)}
          />{" "}
          {field.name}{" "}
          <span className="text-gray-500 text-sm">({field.type})</span>
        </label>
      ))}

      {selectedFields.length > 0 && (
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
          onClick={saveForm}
        >
          Save Form
        </button>
      )}
    </div>
  );
}
