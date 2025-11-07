import React, { useState, useEffect } from "react";
import { useSuppliers } from "../hooks/useSuppliers";

export default function SupplierForm({ supplier = null, onClose = () => {} }) {
  const { addSupplier, updateSupplier } = useSuppliers();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || "");
      setContact(supplier.contact || "");
    }
  }, [supplier]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: name.trim(), contact: contact.trim() };
      if (!payload.name) return;
      if (supplier && supplier.id) {
        await updateSupplier(supplier.id, payload);
      } else {
        await addSupplier(payload);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <div>
        <label className="block text-sm">Nome</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Contato</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}