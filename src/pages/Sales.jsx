import React, { useState, useMemo } from "react";
import { useSales, useAuth, useProducts } from "../hooks";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function Sales() {
  const { user } = useAuth();
  const { sales, loading, error } = useSales();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.productId && formData.quantity && formData.price) {
      console.log("Adicionando venda:", formData);
      setFormData({ productId: "", quantity: "", price: "" });
      setShowForm(false);
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + (s.valor || s.total || 0), 0);
    const totalQuantity = sales.reduce((sum, s) => sum + (s.quantidade || s.quantity || 0), 0);
    const avgTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

    return { totalRevenue, totalQuantity, avgTicket, totalSales: sales.length };
  }, [sales]);

  const getProductName = (sale) => {
    return sale.produto || sale.name || "Produto desconhecido";
  };

  if (loading) return <div className="text-[rgb(var(--fg))] text-center py-8">Carregando...</div>;

  if (error) return <div className="text-red-400 text-center py-8">Erro: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--fg))]">Vendas</h1>
          <p className="text-[rgb(var(--muted))]">Gerencie suas vendas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-xl p-6">
          <p className="text-white/70 text-sm mb-2">Total de Vendas</p>
          <p className="text-3xl font-bold text-blue-400">{stats.totalSales}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/20 rounded-xl p-6">
          <p className="text-white/70 text-sm mb-2">Receita Total</p>
          <p className="text-3xl font-bold text-emerald-400">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-xl p-6">
          <p className="text-white/70 text-sm mb-2">Quantidade Vendida</p>
          <p className="text-3xl font-bold text-purple-400">{stats.totalQuantity}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/20 rounded-xl p-6">
          <p className="text-white/70 text-sm mb-2">Ticket Médio</p>
          <p className="text-3xl font-bold text-cyan-400">
            {formatCurrency(stats.avgTicket)}
          </p>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-6 border border-white/10">
          <h2 className="text-lg font-bold text-[rgb(var(--fg))] mb-4">Registrar Venda</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--fg))] mb-1">
                Produto
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))]"
              >
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome || p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--fg))] mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--fg))] mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-[rgb(var(--fg))] px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela */}
      <div className="card overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left p-4 text-[rgb(var(--fg))] font-semibold">
                  Produto
                </th>
                <th className="text-left p-4 text-[rgb(var(--fg))] font-semibold">
                  Quantidade
                </th>
                <th className="text-left p-4 text-[rgb(var(--fg))] font-semibold">
                  Preço Unit.
                </th>
                <th className="text-left p-4 text-[rgb(var(--fg))] font-semibold">
                  Total
                </th>
                <th className="text-left p-4 text-[rgb(var(--fg))] font-semibold">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-white/40">
                    Nenhuma venda registrada
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 text-[rgb(var(--fg))] font-medium">
                      {getProductName(sale)}
                    </td>
                    <td className="p-4 text-[rgb(var(--fg))]">
                      {sale.quantidade}
                    </td>
                    <td className="p-4 font-semibold text-green-400">
                      {formatCurrency(sale.preco)}
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">
                      {formatCurrency(sale.valor)}
                    </td>
                    <td className="p-4 text-[rgb(var(--muted))] text-sm">
                      {sale.date?.toLocaleDateString?.("pt-BR") || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}