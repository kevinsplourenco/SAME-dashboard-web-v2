import React, { useState } from "react";
import { useAccounts } from "../hooks";
import { useAuth } from "../hooks/useAuth";
import { Plus, Edit2, Trash2, X, CreditCard, Wallet, Eye, EyeOff } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { formatCurrency } from "../utils/formatters";

export default function Accounts() {
  const { user } = useAuth();
  const { accounts, loading, error } = useAccounts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showBalances, setShowBalances] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountType: "corrente",
    accountNumber: "",
    agency: "",
    holder: "",
    balance: "0",
  });

  const bankOptions = [
    "Banco do Brasil",
    "Bradesco",
    "Itaú",
    "Santander",
    "Caixa Econômica",
    "BTG Pactual",
    "Inter",
    "Nubank",
    "Outro",
  ];

  const accountTypes = [
    { value: "corrente", label: "Conta Corrente" },
    { value: "poupanca", label: "Poupança" },
    { value: "investimento", label: "Investimento" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accountData = {
        bankName: formData.bankName || "Sem nome",
        accountType: formData.accountType,
        accountNumber: formData.accountNumber || "0000000",
        agency: formData.agency || "0000",
        holder: formData.holder || "Sem titular",
        balance: parseFloat(formData.balance) || 0,
        createdAt: new Date(),
      };

      if (editingId) {
        const accountRef = doc(db, `tenants/${user.uid}/accounts`, editingId);
        await updateDoc(accountRef, accountData);
        alert("Conta atualizada com sucesso!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, `tenants/${user.uid}/accounts`), accountData);
        alert("Conta adicionada com sucesso!");
      }

      setFormData({
        bankName: "",
        accountType: "corrente",
        accountNumber: "",
        agency: "",
        holder: "",
        balance: "0",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Erro ao salvar conta:", err);
      alert("Erro: " + err.message);
    }
  };

  const handleEdit = (account) => {
    setFormData({
      bankName: account.bankName || "",
      accountType: account.accountType || "corrente",
      accountNumber: account.accountNumber || "",
      agency: account.agency || "",
      holder: account.holder || "",
      balance: (account.balance || 0).toString(),
    });
    setEditingId(account.id);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const idToDelete = deleteConfirm;
    setDeleteConfirm(null); // Fecha o modal IMEDIATAMENTE

    try {
      const accountRef = doc(db, `tenants/${user.uid}/accounts`, idToDelete);
      await deleteDoc(accountRef);
      alert("Conta deletada com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      alert("Erro ao deletar conta: " + err.message);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null); // Fecha IMEDIATAMENTE
  };

  const handleCancel = () => {
    setFormData({
      bankName: "",
      accountType: "corrente",
      accountNumber: "",
      agency: "",
      holder: "",
      balance: "0",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleBalanceVisibility = (accountId) => {
    setShowBalances((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  if (error) {
    return <div className="text-red-400 text-center py-8">Erro: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contas Bancárias</h1>
          <p className="text-white/60">Gerencie suas contas vinculadas</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              bankName: "",
              accountType: "corrente",
              accountNumber: "",
              agency: "",
              holder: "",
              balance: "0",
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Nova Conta
        </button>
      </div>

      {/* Card de Saldo Total */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Saldo Total em Contas</p>
            <h2 className="text-3xl font-bold text-white mt-2">
              {formatCurrency(totalBalance)}
            </h2>
          </div>
          <div className="p-4 rounded-lg bg-purple-600/20">
            <Wallet size={32} className="text-purple-400" />
          </div>
        </div>
      </div>

      {/* Modal de Confirmação deDelete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Deletar Conta?</h3>
            <p className="text-white/60 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Deletar
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Editar Conta" : "Adicionar Conta Bancária"}
            </h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-white/10 rounded transition"
            >
              <X size={20} className="text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Banco
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "#1a1a2e",
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}>
                    Selecione um banco
                  </option>
                  {bankOptions.map((bank) => (
                    <option
                      key={bank}
                      value={bank}
                      style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
                    >
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Tipo de Conta
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "#1a1a2e",
                    color: "#ffffff",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {accountTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      style={{ backgroundColor: "#1a1a2e", color: "#ffffff" }}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  placeholder="0000"
                  value={formData.agency}
                  onChange={(e) =>
                    setFormData({ ...formData, agency: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Número da Conta
                </label>
                <input
                  type="text"
                  placeholder="0000000-0"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Titular da Conta
              </label>
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.holder}
                onChange={(e) =>
                  setFormData({ ...formData, holder: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Saldo Inicial
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({ ...formData, balance: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                {editingId ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="text-center text-white/40 py-12">
          Nenhuma conta cadastrada
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#0d0d14] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-600/20">
                    <CreditCard size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {account.bankName}
                    </h3>
                    <p className="text-white/60 text-xs">
                      {account.accountType === "corrente"
                        ? "Conta Corrente"
                        : account.accountType === "poupanca"
                        ? "Poupança"
                        : "Investimento"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 hover:bg-purple-600/20 rounded-lg transition"
                  >
                    <Edit2 size={16} className="text-purple-400" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(account.id)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-white/60 text-xs">Titular</p>
                  <p className="text-white font-medium">{account.holder}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {account.agency && (
                    <div>
                      <p className="text-white/60 text-xs">Agência</p>
                      <p className="text-white font-medium">{account.agency}</p>
                    </div>
                  )}
                  {account.accountNumber && (
                    <div>
                      <p className="text-white/60 text-xs">Conta</p>
                      <p className="text-white font-medium">
                        {account.accountNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs">Saldo</p>
                    <p className="text-lg font-bold text-green-400">
                      {showBalances[account.id]
                        ? formatCurrency(account.balance || 0)
                        : "••••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleBalanceVisibility(account.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    {showBalances[account.id] ? (
                      <Eye size={16} className="text-white/60" />
                    ) : (
                      <EyeOff size={16} className="text-white/60" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}