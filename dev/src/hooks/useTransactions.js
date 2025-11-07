import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, `tenants/${user.uid}/sales`),
        orderBy("at", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const raw = doc.data();
            const quantity = raw.quantity ?? raw.qty ?? 1;
            const unitPrice = Number(raw.price ?? raw.valor ?? 0);
            const total = Number(raw.total ?? unitPrice * quantity);
            const rawDate = raw.at?.toDate?.()
              ? raw.at.toDate()
              : raw.date?.toDate?.()
              ? raw.date.toDate()
              : raw.at
              ? new Date(raw.at)
              : raw.date
              ? new Date(raw.date)
              : null;

            return {
              id: doc.id,
              ...raw,
              description:
                raw.description ??
                raw.label ??
                raw.productName ??
                raw.name ??
                "Venda",
              amount: total,
              total,
              type: "entrada",
              date: rawDate,
            };
          });
          setTransactions(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar transações:", err);
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

  return { transactions, loading, error };
}