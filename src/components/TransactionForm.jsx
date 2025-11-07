import React, { useState } from "react";
import { X } from "lucide-react";

export default function TransactionForm({ onSubmit, onClose, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      description: "",
      type: "entrada",
      amount: "",
      category: "vendas",
      date: new Date().toISOString().split("T")[0],
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Editar Transação" : "Nova Transação"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Venda de produto"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tipo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-500 focus:outline-none transition"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-500 focus:outline-none transition"
            >
              <option value="vendas">Vendas</option>
              <option value="despesas">Despesas</option>
              <option value="salarios">Salários</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Valor
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary-500 focus:outline-none transition"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}