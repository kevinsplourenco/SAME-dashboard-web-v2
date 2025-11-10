import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export function ExpiringProducts() {
  // Este componente mostra produtos com data de vencimento próxima
  // Campo utilizado: expiry (tipo: Timestamp do Firebase)
  const { products } = useProducts();

  const expiring = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return products
      .filter((p) => {
        if (!p.expiry) return false;
        try {
          // Converte Timestamp do Firebase para Date
          let expDate;
          if (p.expiry.toDate) {
            // Firebase Timestamp
            expDate = p.expiry.toDate();
          } else {
            // String ISO ou Date
            expDate = new Date(p.expiry);
          }
          
          // Verifica se a data é válida
          if (isNaN(expDate.getTime())) return false;
          // Retorna apenas produtos que vencem nos próximos 30 dias
          return expDate <= thirtyDaysFromNow && expDate > now;
        } catch (err) {
          console.error("Erro ao processar data de vencimento:", err);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          let dateA = a.expiry.toDate ? a.expiry.toDate() : new Date(a.expiry);
          let dateB = b.expiry.toDate ? b.expiry.toDate() : new Date(b.expiry);
          return dateA - dateB;
        } catch {
          return 0;
        }
      });
  }, [products]);

  const daysUntilExpiry = (date) => {
    try {
      const now = new Date();
      let expDate;
      if (date.toDate) {
        // Firebase Timestamp
        expDate = date.toDate();
      } else {
        // String ISO ou Date
        expDate = new Date(date);
      }
      const days = Math.floor((expDate - now) / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return 0;
    }
  };

  const formatDate = (date) => {
    try {
      let expDate;
      if (date.toDate) {
        // Firebase Timestamp
        expDate = date.toDate();
      } else {
        // String ISO ou Date
        expDate = new Date(date);
      }
      return expDate.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
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
        <div className="text-center text-white/40 py-8">
          <p>Nenhum produto vencendo em breve</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expiring.map((product) => {
            const days = daysUntilExpiry(product.expiry);
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
                  {formatDate(product.expiry)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}