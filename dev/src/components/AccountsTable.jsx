import React from "react";
import { formatCurrency } from "../utils/formatters";
import { Edit2, Trash2 } from "lucide-react";

export default function AccountsTable({
  accounts = [],
  onEdit = () => {},
  onDelete = () => {},
}) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        Nenhuma conta cadastrada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">
              Nome
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">
              Tipo
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">
              Banco
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-white/80">
              Saldo
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-white/80">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="space-y-2">
          {accounts.map((account) => (
            <tr
              key={account.id}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="py-3 px-4 text-white">{account.name}</td>
              <td className="py-3 px-4 text-white/80 text-sm">
                {account.type}
              </td>
              <td className="py-3 px-4 text-white/80 text-sm">
                {account.bank || "-"}
              </td>
              <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                {formatCurrency(account.balance)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(account)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Edit2 size={16} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}