import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export function ExpiringProducts() {
  // Este componente assume que você adicione campo "expirationDate" ao produto
  const { products } = useProducts();

  const expiring = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return products
      .filter((p) => {
        if (!p.expirationDate) return false;
        const expDate = new Date(p.expirationDate);
        return expDate <= thirtyDaysFromNow && expDate > now;
      })
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
  }, [products]);

  const daysUntilExpiry = (date) => {
    const now = new Date();
    const expDate = new Date(date);
    const days = Math.floor((expDate - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="text-orange-500" size={20} />
        <h3 className="text-lg font-bold text-white">
          Produtos Vencendo ({expiring.length})
        </h3>
      </div>

      {expiring.length === 0 ? (
        <div className="text-center text-white/40 py-8">Nenhum produto vencendo em breve</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expiring.map((product) => {
            const days = daysUntilExpiry(product.expirationDate);
            const isUrgent = days <= 7;

            return (
              <div
                key={product.id}
                className={`flex items-center justify-between p-4 rounded-lg transition ${
                  isUrgent
                    ? "bg-red-500/10 border border-red-500/30 hover:bg-red-500/20"
                    : "bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20"
                }`}
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{product.nome || product.name}</p>
                  <p className="text-white/60 text-sm">
                    Vence em: <span className={isUrgent ? "text-red-400" : "text-orange-400"}>
                      {days} dia{days !== 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded ${
                  isUrgent
                    ? "bg-red-500/30 text-red-300"
                    : "bg-orange-500/30 text-orange-300"
                }`}>
                  {new Date(product.expirationDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}