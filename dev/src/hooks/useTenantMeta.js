import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";

export function useTenantMeta() {
  const { user } = useAuth();
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!user) {
      setMeta(null);
      return;
    }

    const ref = doc(db, "tenants", user.uid, "meta", "settings");
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setMeta(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      },
      (err) => {
        console.error("Erro ao carregar meta settings:", err);
        setMeta(null);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return meta;
}