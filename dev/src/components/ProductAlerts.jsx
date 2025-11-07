import React, { useMemo } from "react";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export function ProductAlerts() {
  const { products } = useProducts();

  const alerts = useMemo(() => {
    const lowStock = products.filter(
      (p) => (p.estoque || p.quantity || 0) <= (p.minStock || 10)
    );

    return {
      lowStock: lowStock.sort((a, b) => (a.estoque || a.quantity || 0) - (b.estoque || b.quantity || 0)),
      count: lowStock.length,
    };
  }, [products]);

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="text-yellow-500" size={20} />
        <h3 className="text-lg font-bold text-white">
          Alertas de Estoque ({alerts.count})
        </h3>
      </div>

      {alerts.lowStock.length === 0 ? (
        <div className="text-center text-white/40 py-8">Estoque em bom estado</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.lowStock.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition"
            >
              <div className="flex-1">
                <p className="text-white font-medium">{product.nome || product.name}</p>
                <p className="text-white/60 text-sm">
                  Estoque: <span className="text-yellow-400 font-bold">{product.estoque || product.quantity || 0}</span>
                  {product.minStock && ` / Mínimo: ${product.minStock}`}
                </p>
              </div>
              <TrendingDown className="text-yellow-500" size={20} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}