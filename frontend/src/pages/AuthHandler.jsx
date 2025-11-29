import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("🔍 Received Token:", token);

    if (token) {

      localStorage.setItem("token", token);

      console.log("💾 Token saved, redirecting...");

      navigate("/select-table", { replace: true });
    } else {
      console.log("No token found — redirecting to login.");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <p className="p-6">Authenticating...</p>;
}
