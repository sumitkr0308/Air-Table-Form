import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/select-table"); 
  }, []);

  const loginUrl = `http://localhost:4000/auth/login`;

  return (
    <div className="p-6">
      <button 
        onClick={() => window.location.href = loginUrl}
        className="bg-blue-600 px-6 py-2 text-white rounded"
      >
        Login with Airtable
      </button>
    </div>
  );
}
