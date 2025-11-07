import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTransaction = async (payload) => {
    if (!user) throw new Error("Usuário não autenticado");
    return addDoc(collection(db, "transactions"), {
      ...payload,
      userId: user.uid,
      createdAt: new Date(),
    });
  };

  const updateTransaction = async (id, payload) => {
    return updateDoc(doc(db, "transactions", id), payload);
  };

  const deleteTransaction = async (id) => {
    return deleteDoc(doc(db, "transactions", id));
  };

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
}