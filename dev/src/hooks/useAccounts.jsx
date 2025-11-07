import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, `tenants/${user.uid}/accounts`),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: doc.id,
            ...raw,
            balance: Number(raw.balance ?? 0),
            createdAt: raw.createdAt?.toDate?.()
              ? raw.createdAt.toDate()
              : raw.createdAt
              ? new Date(raw.createdAt)
              : null,
          };
        });
        setAccounts(data);
        setLoading(false);
      }, (err) => {
        console.error("Erro ao carregar contas:", err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  return { accounts, loading, error };
}