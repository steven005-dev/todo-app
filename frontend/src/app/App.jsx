import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1A1A24",
            border: "1px solid #2E2E3E",
            color: "#F0F0F5",
          },
        }}
      />
    </>
  );
}
export { App as default };
