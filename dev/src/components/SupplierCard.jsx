import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SupplierCard({ supplier, onEdit, onDelete }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
          <p className="text-sm text-white/60">{supplier.category}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-white/80">
        {supplier.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-cyan-400" />
            <span>{supplier.phone}</span>
          </div>
        )}
        {supplier.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-cyan-400" />
            <span>{supplier.email}</span>
          </div>
        )}
        {supplier.address && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            <span>{supplier.address}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
        <button
          onClick={() => onEdit(supplier)}
          className="flex-1 px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(supplier.id)}
          className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
        >
          Remover
        </button>
      </div>
    </div>
  );
}