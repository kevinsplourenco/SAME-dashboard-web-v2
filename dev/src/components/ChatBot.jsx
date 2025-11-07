import React, { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";

const FAQ_TREE = {
  root: {
    title: "Olá! 👋 Como posso ajudar?",
    options: [
      { label: "Dúvidas sobre login", next: "login" },
      { label: "Como usar o dashboard", next: "dashboard" },
      { label: "Problemas técnicos", next: "technical" },
      { label: "Sobre o SAME", next: "about" },
    ],
  },
  login: {
    title: "🔑 Dúvidas sobre Login",
    options: [
      { label: "Esqueci minha senha", next: "forgot_password" },
      { label: "Não consigo criar conta", next: "create_account" },
      { label: "Login com Google não funciona", next: "google_login" },
      { label: "Voltar", next: "root" },
    ],
  },
  forgot_password: {
    title: "Esqueci minha senha",
    message: "Clique em 'Esqueci minha senha' na tela de login, insira seu e-mail e você receberá um link para redefinir sua senha em poucos minutos.",
    options: [{ label: "Voltar", next: "login" }],
  },
  create_account: {
    title: "Não consigo criar conta",
    message: "Verifique se:\n• Seu e-mail é válido\n• A senha tem pelo menos 6 caracteres\n• As senhas conferem\n\nSe o problema persistir, tente fazer login com Google!",
    options: [{ label: "Voltar", next: "login" }],
  },
  google_login: {
    title: "Login com Google",
    message: "Se o login com Google não funciona:\n• Verifique sua conexão de internet\n• Limpe o cache do navegador\n• Tente em outro navegador",
    options: [{ label: "Voltar", next: "login" }],
  },
  dashboard: {
    title: "📊 Como usar o Dashboard",
    options: [
      { label: "Entender as métricas", next: "metrics" },
      { label: "Adicionar produtos", next: "products" },
      { label: "Registrar vendas", next: "sales" },
      { label: "Voltar", next: "root" },
    ],
  },
  metrics: {
    title: "Entender as Métricas",
    message: "O dashboard mostra:\n• Saldo Total\n• Entradas\n• Saídas\n• Estoque",
    options: [{ label: "Voltar", next: "dashboard" }],
  },
  products: {
    title: "Adicionar Produtos",
    message: "1. Clique em 'Novo Produto'\n2. Preencha os dados\n3. Salve",
    options: [{ label: "Voltar", next: "dashboard" }],
  },
  sales: {
    title: "Registrar Vendas",
    message: "1. Vá para Vendas\n2. Preencha os dados\n3. Confirme",
    options: [{ label: "Voltar", next: "dashboard" }],
  },
  technical: {
    title: "⚙️ Problemas Técnicos",
    options: [
      { label: "Página carrega lentamente", next: "slow" },
      { label: "Dados não aparecem", next: "no_data" },
      { label: "Voltar", next: "root" },
    ],
  },
  slow: {
    title: "Página carrega lentamente",
    message: "Tente limpar o cache ou usar outro navegador.",
    options: [{ label: "Voltar", next: "technical" }],
  },
  no_data: {
    title: "Dados não aparecem",
    message: "Comece adicionando produtos e vendas.",
    options: [{ label: "Voltar", next: "technical" }],
  },
  about: {
    title: "ℹ️ Sobre o SAME",
    message: "SAME é uma plataforma de gestão de vendas e fluxo de caixa.",
    options: [{ label: "Voltar", next: "root" }],
  },
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("root");
  const [messages, setMessages] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{ type: "bot", text: FAQ_TREE.root.title }]);
    }
  };

  const handleOption = (next) => {
    setMessages((prev) => [...prev, { type: "user", text: "..." }]);
    setCurrent(next);
    const nextNode = FAQ_TREE[next];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", text: nextNode.message || nextNode.title },
      ]);
    }, 300);
  };

  const node = FAQ_TREE[current];

  return (
    <>
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-primary-600 text-white flex items-center justify-center shadow-lg z-40"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h3 className="font-bold text-white">SAME Bot</h3>
              <p className="text-xs text-white/60">Sempre pronto para ajudar</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "bot" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.type === "bot"
                      ? "bg-white/10 text-white"
                      : "bg-primary-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div className="space-y-2 mt-2">
              {node.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOption(option.next)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm text-left transition"
                >
                  <span>{option.label}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}