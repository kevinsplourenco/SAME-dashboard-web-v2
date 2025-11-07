import React, { useState } from "react";
import { useAuth } from "../hooks";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword({ onBack }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0284c7 0%, #5b21b6 50%, #111827 100%)",
      }}
    >
      {/* Efeito de fundo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ background: "rgba(6, 182, 212, 0.2)" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background: "rgba(168, 85, 247, 0.2)",
            animationDelay: "1000ms",
          }}
        ></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-8 text-white space-y-6 shadow-2xl"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: "1px",
          }}
        >
          <header>
            <h2 className="text-2xl font-bold">Recuperar Senha</h2>
            <p className="text-white/60 text-sm mt-1">
              Digite seu email para receber um link de recuperação
            </p>
          </header>

          {success ? (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: "rgba(5, 46, 22, 0.4)",
                borderColor: "rgba(34, 197, 94, 0.5)",
                borderWidth: "1px",
                color: "#86efac",
              }}
            >
              ✓ Email de recuperação enviado! Verifique sua caixa de entrada.
            </div>
          ) : (
            <>
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    background: "rgba(127, 29, 29, 0.4)",
                    borderColor: "rgba(239, 68, 68, 0.5)",
                    borderWidth: "1px",
                    color: "#fca5a5",
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-xl px-4 py-3 outline-none transition"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: "1px",
                    color: "white",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22d3ee";
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 font-bold transition"
                style={{
                  background: "linear-gradient(to right, #06b6d4, #0284c7)",
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Enviando..." : "Enviar Link"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-white/70 hover:text-cyan-400 transition font-medium"
                  style={{
                    outline: "none",
                    border: "none",
                    background: "none",
                    padding: 0,
                  }}
                >
                  Volte ao login
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2024 SAME. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}