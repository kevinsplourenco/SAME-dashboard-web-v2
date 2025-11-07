import React from "react";
import { formatCurrency } from "../utils/formatters";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TransactionList({ transactions = [], showActions = true }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-[rgb(var(--fg))] opacity-60">
        Nenhuma transação registrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[rgb(var(--fg))]">Últimas Vendas</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`p-2 rounded-lg ${
                  transaction.type === "entrada"
                    ? "bg-emerald-900/30"
                    : "bg-red-900/30"
                }`}
              >
                {transaction.type === "entrada" ? (
                  <TrendingUp size={18} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={18} className="text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-white/60">
                  {transaction.createdAt?.toLocaleDateString?.("pt-BR") ||
                    new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  transaction.type === "entrada"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "entrada" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}