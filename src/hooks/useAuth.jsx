import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const tenantId = authUser.uid;
          const settingsDoc = await getDoc(
            doc(db, "tenants", tenantId, "meta", "settings")
          );

          const userData = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
          };

          // Buscar nome correto do settings
          if (settingsDoc.exists()) {
            const settingsData = settingsDoc.data();
            if (settingsData?.fantasyName) {
              userData.displayName = settingsData.fantasyName;
            } else if (settingsData?.displayName) {
              userData.displayName = settingsData.displayName;
            }
          }

          setUser(userData);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}