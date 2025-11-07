import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useCashFlow() {
  const { user } = useAuth();
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setCashFlow([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, `tenants/${user.uid}/cashflows`),
        orderBy("when", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const raw = doc.data();
            const rawDate = raw.when?.toDate?.()
              ? raw.when.toDate()
              : raw.date?.toDate?.()
              ? raw.date.toDate()
              : raw.when
              ? new Date(raw.when)
              : raw.date
              ? new Date(raw.date)
              : null;

            let normalizedType = (raw.type || raw.kind || "entrada").toLowerCase();
            if (normalizedType === "saída") {
              normalizedType = "saida";
            }

            return {
              id: doc.id,
              ...raw,
              // Mapeamento para compatibilidade
              descricao: raw.descricao ?? raw.description ?? raw.category ?? "Fluxo",
              valor: Number(raw.valor ?? raw.amount ?? 0),
              categoria: raw.categoria ?? raw.category ?? "Geral",
              tipo: normalizedType,
              // Campos normalizados
              amount: Number(raw.amount ?? raw.valor ?? 0),
              type: normalizedType,
              description: raw.description ?? raw.descricao ?? raw.category ?? "Fluxo",
              category: raw.category ?? raw.categoria ?? "Geral",
              date: rawDate,
            };
          });
          setCashFlow(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar fluxo de caixa:", err);
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

  return { cashFlow, loading, error };
}