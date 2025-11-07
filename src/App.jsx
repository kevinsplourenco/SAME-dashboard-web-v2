import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<MainLayout />} />
          <Route path="/cashflow" element={<MainLayout />} />
          <Route path="/sales" element={<MainLayout />} />
          <Route path="/products" element={<MainLayout />} />
          <Route path="/suppliers" element={<MainLayout />} />
          <Route path="/accounts" element={<MainLayout />} />
          <Route path="/relatorios" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
