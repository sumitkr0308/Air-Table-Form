import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SelectTable from "./pages/SelectTable";
import FormBuilder from "./pages/FormBuilder";
import FormViewer from "./pages/FormViewer";
import Responses from "./pages/Responses";
import AuthHandler from "./pages/AuthHandler";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<AuthHandler />} />

        {/* Protected */}
        <Route
          path="/select-table"
          element={
            <ProtectedRoute>
              <SelectTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form/:formId"
          element={
            <ProtectedRoute>
              <FormViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/responses/:formId"
          element={
            <ProtectedRoute>
              <Responses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
