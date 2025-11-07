import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, auth } from "../services/firebase";
import { useAuth } from "../hooks";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (mode === "forgot") {
    return <ForgotPassword onBack={() => setMode("login")} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (password.length < 6) throw new Error("A senha deve ter 6 caracteres.");
        if (password !== confirm) throw new Error("As senhas não conferem.");
        await signUp(email, password);
        setMessage("Conta criada! Redirecionando...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        await signIn(auth, email, password);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Erro ao processar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      if (err.code === "auth/popup-blocked") {
        setError("Pop-up foi bloqueado. Permita pop-ups para este site.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelado. Tente novamente.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Erro de conexão. Verifique sua internet.");
      } else {
        setError(err.message || "Erro ao logar com Google.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0284c7 0%, #5b21b6 50%, #111827 100%)"
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
          style={{ background: "rgba(168, 85, 247, 0.2)", animationDelay: "1000ms" }}
        ></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo e Nome do App */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-2xl blur-lg opacity-75"
                style={{ background: "linear-gradient(to right, #06b6d4, #0284c7)" }}
              ></div>
              {/* Card do ícone */}
              <div 
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center border shadow-2xl"
                style={{ 
                  background: "linear-gradient(to bottom right, #06b6d4, #0284c7)",
                  borderColor: "rgba(255, 255, 255, 0.3)"
                }}
              >
                {/* Tubarão SVG */}
                <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="currentColor">
                  {/* Corpo */}
                  <ellipse cx="50" cy="50" rx="35" ry="25" />
                  {/* Cabeça */}
                  <circle cx="75" cy="45" r="18" />
                  {/* Focinho */}
                  <polygon points="90,45 95,42 95,48" fill="currentColor" />
                  {/* Olho */}
                  <circle cx="82" cy="40" r="3" fill="white" />
                  {/* Barbatana dorsal */}
                  <polygon points="50,20 45,35 55,35" fill="currentColor" opacity="0.8" />
                  {/* Cauda */}
                  <polygon points="15,45 5,35 5,55" fill="currentColor" opacity="0.9" />
                  {/* Barbatana lateral */}
                  <ellipse cx="45" cy="65" rx="8" ry="12" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
              SAME
            </h1>
            <p 
              className="text-lg font-semibold bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #cffafe, #bfdbfe, #d8b4fe)"
              }}
            >
              Gestão de Vendas & Fluxo de Caixa
            </p>
            <p className="text-white/60 text-sm">Controle suas finanças com precisão</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-8 text-white space-y-6 shadow-2xl"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: "1px"
          }}
        >
          <header>
            <h2 className="text-2xl font-bold">
              {mode === "signup" ? "Criar Conta" : "Bem-vindo de Volta"}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {mode === "signup"
                ? "Comece a gerenciar suas vendas agora."
                : "Acesse seu painel de controle."}
            </p>
          </header>

          {(error || message) && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: error ? "rgba(127, 29, 29, 0.4)" : "rgba(5, 46, 22, 0.4)",
                borderColor: error ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.5)",
                borderWidth: "1px",
                color: error ? "#fca5a5" : "#86efac"
              }}
            >
              {error || message}
            </div>
          )}

          <div className="space-y-4">
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
                  color: "white"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                className="w-full rounded-xl px-4 py-3 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: "1px",
                  color: "white"
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
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  className="w-full rounded-xl px-4 py-3 outline-none transition"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: "1px",
                    color: "white"
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
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl px-4 py-3 font-bold transition"
            style={{
              background: "linear-gradient(to right, #06b6d4, #0284c7)",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
              opacity: submitting ? 0.5 : 1
            }}
          >
            {submitting
              ? "Processando..."
              : mode === "signup"
              ? "Criar Conta"
              : "Entrar"}
          </button>

          {mode === "login" && (
            <>
              <div className="relative flex items-center gap-3">
                <div 
                  className="flex-1 h-px"
                  style={{
                    backgroundImage: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)"
                  }}
                ></div>
                <span className="text-xs text-white/60 font-medium">OU</span>
                <div 
                  className="flex-1 h-px"
                  style={{
                    backgroundImage: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)"
                  }}
                ></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={submitting}
                className="w-full rounded-xl px-4 py-3 transition font-medium flex items-center justify-center gap-3"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderWidth: "1px",
                  opacity: submitting ? 0.5 : 1,
                  outline: "none"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </button>
            </>
          )}

          <div className="flex flex-col gap-3 text-sm text-white/70 pt-2">
            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setMessage("");
                }}
                className="text-left transition font-medium hover:text-cyan-400"
                style={{ outline: "none", border: "none", background: "none", padding: 0 }}
              >
                Esqueceu sua senha?
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMode((prev) => (prev === "login" ? "signup" : "login"));
                setError("");
                setMessage("");
              }}
              className="text-left transition font-medium hover:text-cyan-400"
              style={{ outline: "none", border: "none", background: "none", padding: 0 }}
            >
              {mode === "login"
                ? "Não tem conta? Crie uma"
                : "Já tem conta? Faça login"}
            </button>
          </div>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2024 SAME. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}