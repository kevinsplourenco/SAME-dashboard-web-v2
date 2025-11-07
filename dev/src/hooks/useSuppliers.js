import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useSuppliers() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSuppliers([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, `tenants/${user.uid}/suppliers`));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSuppliers(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar fornecedores:", err);
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

  return { suppliers, loading, error };
}