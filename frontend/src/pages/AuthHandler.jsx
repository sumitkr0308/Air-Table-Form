import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthHandler() {
  const navigate = useNavigate();
  console.log("📍 AuthHandler Component Mounted");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("🔍 Received Token:", token);

    if (token) {
      // Save token
      localStorage.setItem("token", token);

      console.log("💾 Token saved. Cleaning URL...");

      // Remove ?token= from URL so reload doesn't retry OAuth
      window.history.replaceState({}, "", "/");

      // Redirect to next step
      navigate("/select-table");
    } else {
      console.log("⚠️ No token found — sending user back to login page");
      navigate("/");
    }
  }, [navigate]);

  return <p className="p-6">Authenticating...</p>;
}
