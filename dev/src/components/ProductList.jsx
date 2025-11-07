import React from "react";
import { formatCurrency } from "../utils/formatters";
import { Package } from "lucide-react";

export default function ProductList({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-white opacity-60">
        Nenhum produto cadastrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Produtos em Estoque</h3>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-blue-900/30">
                <Package size={18} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {product.name}
                </p>
                <p className="text-xs text-white/60">
                  {product.quantity} un. em estoque
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-white/60">
                Total: {formatCurrency(product.price * product.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}