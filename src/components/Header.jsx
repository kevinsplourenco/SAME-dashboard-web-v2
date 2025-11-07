import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LogOut, HelpCircle, Settings, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([]); // Placeholder vazio

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/login");
  };

  // Se user não existir, mostra placeholder
  if (!user) {
    return (
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 2rem",
          backgroundColor: "#1a1a2e",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.875rem",
              margin: "0.25rem 0 0 0",
            }}
          >
            Bem-vindo de volta!
          </p>
        </div>
        <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Carregando...</div>
      </header>
    );
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem 2rem",
        backgroundColor: "#1a1a2e",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        minHeight: "80px",
      }}
    >
      {/* Left side - Welcome message */}
      <div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            margin: "0.25rem 0 0 0",
          }}
        >
          Bem-vindo de volta!
        </p>
      </div>

      {/* Right side - Notifications and Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
            }
          >
            <Bell size={20} style={{ color: "#ffffff" }} />
            {notifications.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {notifications.length}
              </div>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 0.5rem)",
                width: "300px",
                backgroundColor: "#1a1a2e",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Notificações
                </h3>
              </div>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <Bell
                    size={32}
                    style={{ margin: "0 auto 0.5rem", opacity: 0.5 }}
                  />
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: "0.75rem 1rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        fontSize: "0.875rem",
                      }}
                    >
                      {notif.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
            }
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={16} style={{ color: "#ffffff" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                {user?.displayName || "Usuário"}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: "0.125rem 0 0 0",
                }}
              >
                {user?.email}
              </p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 0.5rem)",
                width: "200px",
                backgroundColor: "#1a1a2e",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {user?.displayName || "Usuário"}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: "0.25rem 0 0 0",
                  }}
                >
                  {user?.email}
                </p>
              </div>

              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <User size={16} />
                Meu Perfil
              </button>

              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <Settings size={16} />
                Configurações
              </button>

              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <HelpCircle size={16} />
                Ajuda e Suporte
              </button>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgba(244, 63, 94, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}