import React, { useState } from "react";
import { useSuppliers, useAuth } from "../hooks";
import { Plus, Edit2, Trash2, X, Phone, Mail, MapPin } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Suppliers() {
  const { user } = useAuth();
  const { suppliers, loading, error } = useSuppliers();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Preencha nome e email");
      return;
    }

    try {
      const supplierData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        state: formData.state || "",
      };

      if (editingId) {
        const supplierRef = doc(db, `tenants/${user.uid}/suppliers`, editingId);
        await updateDoc(supplierRef, supplierData);
        alert("Fornecedor atualizado com sucesso!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, `tenants/${user.uid}/suppliers`), supplierData);
        alert("Fornecedor adicionado com sucesso!");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err);
      alert("Erro ao salvar fornecedor: " + err.message);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      city: supplier.city || "",
      state: supplier.state || "",
    });
    setEditingId(supplier.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este fornecedor?")) return;

    try {
      await deleteDoc(doc(db, `tenants/${user.uid}/suppliers`, id));
      alert("Fornecedor deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar fornecedor:", err);
      alert("Erro ao deletar fornecedor: " + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="text-white text-center py-8">Carregando...</div>;

  if (error) {
    return <div className="text-red-400 text-center py-8">Erro: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
          <p className="text-white/60">Gerencie seus fornecedores</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Plus size={20} />
          Novo Fornecedor
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Editar Fornecedor" : "Adicionar Fornecedor"}
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
                placeholder="Nome da empresa"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="email@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Endereço
              </label>
              <input
                type="text"
                placeholder="Rua, número"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="São Paulo"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  placeholder="SP"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
                />
              </div>
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

      {suppliers.length === 0 ? (
        <div className="text-center text-white/40 py-8">
          Nenhum fornecedor cadastrado
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{supplier.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="p-2 hover:bg-purple-600/20 rounded-lg transition"
                  >
                    <Edit2 size={16} className="text-purple-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Mail size={16} className="text-blue-400" />
                    <a href={`mailto:${supplier.email}`} className="hover:text-blue-400">
                      {supplier.email}
                    </a>
                  </div>
                )}

                {supplier.phone && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Phone size={16} className="text-green-400" />
                    <a href={`tel:${supplier.phone}`} className="hover:text-green-400">
                      {supplier.phone}
                    </a>
                  </div>
                )}

                {(supplier.address || supplier.city || supplier.state) && (
                  <div className="flex items-start gap-2 text-white/60 text-sm pt-2 border-t border-white/10">
                    <MapPin size={16} className="text-yellow-400 mt-0.5" />
                    <div>
                      {supplier.address && <div>{supplier.address}</div>}
                      {(supplier.city || supplier.state) && (
                        <div>
                          {supplier.city} {supplier.state}
                        </div>
                      )}
                    </div>
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