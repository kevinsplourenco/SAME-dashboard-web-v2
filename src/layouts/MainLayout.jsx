import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import CashFlow from "../pages/CashFlow";
import Sales from "../pages/Sales";
import Products from "../pages/Products";
import Suppliers from "../pages/Suppliers";
import Accounts from "../pages/Accounts";
import Relatorios from "../pages/Relatorios";

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#0f0f1e",
        }}
      >
        <h2 style={{ color: "#ffffff" }}>Carregando...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderPage = () => {
    switch (location.pathname) {
      case "/":
        return <Dashboard />;
      case "/cashflow":
        return <CashFlow />;
      case "/sales":
        return <Sales />;
      case "/products":
        return <Products />;
      case "/suppliers":
        return <Suppliers />;
      case "/accounts":
        return <Accounts />;
      case "/relatorios":
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#0f0f1e",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Header />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "2rem",
            backgroundColor: "#0f0f1e",
            minWidth: 0,
          }}
        >
          {children || renderPage()}
        </main>
      </div>
    </div>
  );
}