import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useSales() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSales([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, `tenants/${user.uid}/sales`));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = [];

          snapshot.docs.forEach((doc) => {
            const raw = doc.data();

            // Se a venda tem array de items, expande cada item
            if (raw.items && Array.isArray(raw.items)) {
              raw.items.forEach((item, index) => {
                data.push({
                  id: `${doc.id}-${index}`,
                  saleId: doc.id,
                  ...item,
                  // Normalização
                  produto: item.name || item.productName || "Produto",
                  quantidade: item.qty || item.quantity || 1,
                  preco: item.unitPrice || item.price || 0,
                  valor:
                    item.lineTotal ||
                    item.total ||
                    (item.qty * item.unitPrice),
                  date:
                    raw.createdAt?.toDate?.()
                      ? raw.createdAt.toDate()
                      : raw.createdAt
                      ? new Date(raw.createdAt)
                      : null,
                });
              });
            } else {
              // Fallback para vendas antigas/diferentes
              data.push({
                id: doc.id,
                ...raw,
                produto: raw.produto || raw.productName || raw.name || "Produto",
                quantidade: raw.quantity || raw.qty || 1,
                preco: raw.price || raw.unitPrice || 0,
                valor: raw.total || raw.valor || 0,
                date:
                  raw.at?.toDate?.()
                    ? raw.at.toDate()
                    : raw.date?.toDate?.()
                    ? raw.date.toDate()
                    : raw.at
                    ? new Date(raw.at)
                    : raw.date
                    ? new Date(raw.date)
                    : null,
              });
            }
          });

          // Ordena por data descendente
          data.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          });

          console.log("Vendas carregadas:", data);
          setSales(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar vendas:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  return { sales, loading, error };
}