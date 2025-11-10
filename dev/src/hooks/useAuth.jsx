import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, signInWithGoogle } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      throw error;
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw error;
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      signInWithGoogle: handleSignInWithGoogle,
      signUp: handleSignUp,
      signIn: handleSignIn,
      resetPassword: handleResetPassword
    }}>
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