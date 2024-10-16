// pages/login.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
// import { useRouter } from 'next/router';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  //   const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "LOGIN") {
      await login(username, password);
    } else {
      register(username, password, role);
    }
  };

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");

  return (
    <div className="container flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 p-6 rounded shadow-xl w-full max-w-[500px] flex flex-col items-center"
      >
        <h2 className="title mb-4">Login</h2>
        <div className="mb-4 w-full">
          <label className="block mb-2 bold">Username</label>
          <input
            // type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block mb-2 bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        {mode === "REGISTER" && (
          <div className="mb-4 w-full">
            <label className="block mb-2 bold">Password</label>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={role}
              onChange={handleChange}
            >
              <FormControlLabel
                value="seller"
                control={<Radio />}
                label="Seller"
              />
              <FormControlLabel
                value="buyer"
                control={<Radio />}
                label="Buyer"
              />
              <FormControlLabel
                value="approver"
                control={<Radio />}
                label="Approver"
              />
            </RadioGroup>
          </div>
        )}
        <button type="submit" className="btn-primary">
          {mode === "LOGIN" ? "Login" : "Register"}
        </button>
        <p className="mt-2">
          {mode === "LOGIN"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="font-bold"
            onClick={() => {
              if (mode === "LOGIN") {
                setMode("REGISTER");
              } else {
                setMode("LOGIN");
              }
            }}
          >
            {mode === "LOGIN" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
