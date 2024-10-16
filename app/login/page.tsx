// pages/login.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from 'next/router';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-300 p-6 rounded shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            // type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
