import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, `tenants/${user.uid}/products`));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const raw = doc.data();

            return {
              id: doc.id,
              ...raw,
              // Mapeamento para compatibilidade com consumidores
              nome: raw.name ?? raw.nome ?? "Produto",
              preco: Number(raw.price ?? raw.preco ?? 0),
              estoque: Number(raw.quantity ?? raw.estoque ?? 0),
              categoria: raw.category ?? raw.categoria ?? "Geral",
              sku: raw.sku ?? raw.code ?? "",
              minStock: Number(raw.minStock ?? raw.min_stock ?? 0),
              // Campos normalizados
              name: raw.name ?? raw.nome ?? "Produto",
              price: Number(raw.price ?? raw.preco ?? 0),
              quantity: Number(raw.quantity ?? raw.estoque ?? 0),
            };
          });
          setProducts(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar produtos:", err);
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

  return { products, loading, error };
}