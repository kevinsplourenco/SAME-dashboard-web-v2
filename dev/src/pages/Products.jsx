import React, { useState } from "react";
import { useProducts, useAuth } from "../hooks";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Products() {
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    quantity: "",
    sku: "",
    minStock: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.quantity === "") {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        sku: formData.sku || "",
        minStock: parseInt(formData.minStock) || 10,
      };

      if (editingId) {
        // Editar
        const productRef = doc(db, `tenants/${user.uid}/products`, editingId);
        await updateDoc(productRef, productData);
        alert("Produto atualizado com sucesso!");
        setEditingId(null);
      } else {
        // Adicionar
        await addDoc(collection(db, `tenants/${user.uid}/products`), productData);
        alert("Produto adicionado com sucesso!");
      }

      setFormData({ name: "", price: "", quantity: "", sku: "", minStock: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || product.nome || "",
      price: product.price || product.preco || "",
      quantity: product.quantity || product.estoque || "",
      sku: product.sku || "",
      minStock: product.minStock || 10,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await deleteDoc(doc(db, `tenants/${user.uid}/products`, id));
      alert("Produto deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar produto: " + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", price: "", quantity: "", sku: "", minStock: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="text-[rgb(var(--fg))] text-center py-8">Carregando...</div>;

  if (error) {
    return <div className="text-red-400 text-center py-8">Erro: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--fg))]">Produtos</h1>
          <p className="text-[rgb(var(--muted))]">Gerencie seu inventário</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", price: "", quantity: "", sku: "", minStock: "" });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {showForm && (
        <div className="card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-white/10 rounded transition"
            >
              <X size={20} className="text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nome *
              </label>
              <input
                type="text"
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Preço *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="SKU do produto"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[rgb(var(--fg))] placeholder-[rgb(var(--muted))]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                {editingId ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 text-[rgb(var(--fg))] px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center text-white/40 py-8">
          Nenhum produto cadastrado
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {product.nome || product.name}
                  </h3>
                  {product.sku && (
                    <p className="text-white/60 text-sm">SKU: {product.sku}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 hover:bg-purple-600/20 rounded-lg transition"
                  >
                    <Edit2 size={16} className="text-purple-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/60 text-sm">Preço</span>
                  <span className="text-white font-bold">
                    {formatCurrency(product.preco || product.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/60 text-sm">Estoque</span>
                  <span className={`font-bold ${
                    (product.estoque || product.quantity || 0) <= (product.minStock || 10)
                      ? "text-yellow-400"
                      : "text-white"
                  }`}>
                    {product.estoque || product.quantity || 0}
                  </span>
                </div>
                {product.minStock && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Mínimo</span>
                    <span className="text-white/80 text-sm">{product.minStock}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}