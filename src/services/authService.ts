import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(
    auth,
    googleProvider
  );

  return result.user;
};

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
};

export const createEmailAccount = async (
  email: string,
  password: string
) => {
  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};