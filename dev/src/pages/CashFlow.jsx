import React, { useState, useMemo } from "react";
import { useCashFlow, useAuth, useSales } from "../hooks";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function CashFlow() {
  const { user } = useAuth();
  const { cashFlow, loading, error } = useCashFlow();
  const { sales } = useSales();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: "", amount: "", type: "entrada" });

  // Combinar vendas com cashFlow
  const allMovements = useMemo(() => {
    const movements = [...cashFlow];
    
    // Adicionar vendas como entradas
    sales.forEach((sale) => {
      movements.push({
        id: `sale-${sale.id}`,
        description: `Venda - ${sale.produto || "Produto"}`,
        type: "entrada",
        amount: sale.valor || sale.total || 0,
        date: sale.date,
        isSale: true,
      });
    });

    return movements.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date();
      const dateB = b.date ? new Date(b.date) : new Date();
      return dateB - dateA;
    });
  }, [cashFlow, sales]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      console.log("Adicionando fluxo de caixa:", formData);
      setFormData({ description: "", amount: "", type: "entrada" });
      setShowForm(false);
    }
  };

  const totalIncome = allMovements
    .filter((cf) => cf.type === "entrada")
    .reduce((sum, cf) => sum + (cf.amount || cf.valor || 0), 0);

  const totalExpense = allMovements
    .filter((cf) => cf.type === "saida" || cf.type === "saída")
    .reduce((sum, cf) => sum + (cf.amount || cf.valor || 0), 0);

  const balance = totalIncome - totalExpense;

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fluxo de Caixa</h1>
          <p className="text-white/60">Visualize entradas e saídas (incluindo vendas)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Novo Movimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm">Entradas</span>
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm">Saídas</span>
            <TrendingDown className="text-red-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-red-400">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm">Saldo</span>
            <div className="text-blue-400 text-2xl">💰</div>
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Registrar Movimento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Descrição do movimento"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Valor</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left p-4 text-white font-semibold">Descrição</th>
                <th className="text-left p-4 text-white font-semibold">Tipo</th>
                <th className="text-left p-4 text-white font-semibold">Valor</th>
                <th className="text-left p-4 text-white font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {allMovements.map((cf) => (
                <tr key={cf.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="p-4 text-white">{cf.description || cf.descricao}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cf.type === "entrada" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {cf.type === "entrada" ? "Entrada" : "Saída"}
                      {cf.isSale && " (Venda)"}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${cf.type === "entrada" ? "text-green-400" : "text-red-400"}`}>
                    {formatCurrency(cf.amount || cf.valor)}
                  </td>
                  <td className="p-4 text-white/60 text-sm">
                    {cf.date?.toLocaleDateString?.("pt-BR") || new Date(cf.when || cf.date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}