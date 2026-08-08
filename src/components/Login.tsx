import { useState } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  createEmailAccount,
} from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isSignup) {
        await createEmailAccount(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email already registered. Please sign in.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account exists with this email.");
      } else {
        setError(error.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                L
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Welcome to Lumina AI
          </h1>

          <p className="text-center text-slate-500 mt-3">
            Sign in to continue
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span className="font-bold text-lg">
              G
            </span>

            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />

            <span className="text-sm text-slate-400">
              OR
            </span>

            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Email */}
          <form onSubmit={handleEmail}>

            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your Gmail or email"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <label className="block text-sm font-medium mt-4 mb-2 text-slate-700 dark:text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Sign in with Email"}
            </button>

          </form>

          {/* Signup/Login switch */}
          <div className="text-center mt-5">

            <button
              onClick={() =>
                setIsSignup(!isSignup)
              }
              className="text-blue-600 hover:underline text-sm"
            >
              {isSignup
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}