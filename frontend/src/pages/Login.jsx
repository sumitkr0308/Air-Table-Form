import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/select-table");
    } else {
      setCheckingAuth(false); 
    }
  }, []);

  const loginUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;

  if (checkingAuth) return <p className="p-6">Checking login...</p>;

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
