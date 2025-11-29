import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import  {shouldShowQuestion}  from "../utils/conditionalLogic";

export default function FormViewer() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/forms/${formId}`).then((res) => setForm(res.data));
  }, [formId]);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/responses/${formId}/submit`, answers);

      alert("Form submitted successfully!");
      navigate(`/responses/${formId}`); 
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submit failed");
    }
  };

  if (!form) return <p className="p-6">Loading form...</p>;
  if (submitted) return <h2 className="text-center mt-20 text-2xl text-green-600">Form Submitted Successfully ✔</h2>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form.name}</h2>

      {form.questions.map((q) => {
        const visible = shouldShowQuestion(q.conditionalRules, answers);
        if (!visible) return null;

        return (
          <div key={q.questionKey} className="mb-4">
            <label className="block font-medium mb-1">
              {q.label} {q.required && <span className="text-red-500">*</span>}
            </label>

            {q.type === "singleSelect" ? (
              <select
                className="border p-2 rounded w-full"
                onChange={(e) => handleChange(q.questionKey, e.target.value)}
              >
                <option>Select...</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={answers[q.questionKey] || ""}
                onChange={(e) => handleChange(q.questionKey, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
