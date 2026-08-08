import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGuOFEHbZXnW6s5xhxUM5GvKerbJezkY0",
  authDomain: "ai-rag-code.firebaseapp.com",
  projectId: "ai-rag-code",
  storageBucket: "ai-rag-code.firebasestorage.app",
  messagingSenderId: "935339949190",
  appId: "1:935339949190:web:c37c1924dd546ed25f6507",
  measurementId: "G-KGGQKRL20G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const db = getFirestore(app);

export const analytics =
  getAnalytics(app);

export default app;