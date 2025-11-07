import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Package,
  Truck,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/cashflow", label: "Fluxo de Caixa", icon: TrendingUp },
    { path: "/sales", label: "Vendas", icon: ShoppingBag },
    { path: "/products", label: "Produtos", icon: Package },
    { path: "/suppliers", label: "Fornecedores", icon: Truck },
    { path: "/accounts", label: "Contas", icon: Users },
    { path: "/relatorios", label: "Relatórios", icon: FileText },
  ];

  return (
    <aside
      style={{
        width: "256px",
        backgroundColor: "rgb(31, 31, 46)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "2rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <h1 style={{ color: "rgb(255, 255, 255)", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
          SAME
        </h1>
      </div>

      <nav style={{ flex: "1 1 0%", padding: "2rem 0", overflow: "auto" }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 1.5rem",
              color: isActive(item.path) ? "rgb(139, 92, 246)" : "rgba(255, 255, 255, 0.6)",
              textDecoration: "none",
              borderLeft: isActive(item.path) ? "3px solid rgb(139, 92, 246)" : "3px solid transparent",
              backgroundColor: isActive(item.path) ? "rgba(139, 92, 246, 0.1)" : "transparent",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <item.icon size={20} />
            <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "rgb(239, 68, 68)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: 500,
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          }}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}