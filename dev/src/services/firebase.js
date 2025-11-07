import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2-xHByT0qQBYA8TdkBZbQPQ8mirHGXWM",
  authDomain: "same-40d0e.firebaseapp.com",
  projectId: "same-40d0e",
  storageBucket: "same-40d0e.firebasestorage.app",
  messagingSenderId: "288241109960",
  appId: "1:288241109960:web:12c483943aba541330cefd",
  measurementId: "G-FWY5QBJQL9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signIn = signInWithEmailAndPassword;
export const signUp = createUserWithEmailAndPassword;
export const logout = signOut;
export const resetPassword = sendPasswordResetEmail;
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);