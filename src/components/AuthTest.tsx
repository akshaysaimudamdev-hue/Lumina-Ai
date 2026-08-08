import { useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authService";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);

      setMessage(`Registered: ${user.email}`);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);

      setMessage(`Logged in: ${user.email}`);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      setMessage("Logged out successfully");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">

      <h2 className="text-2xl font-bold">
        Firebase Authentication Test
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded"
      />

      <div className="flex gap-2">

        <button
          onClick={handleRegister}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>

        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {message && (
        <p className="text-sm break-words">
          {message}
        </p>
      )}

    </div>
  );
}