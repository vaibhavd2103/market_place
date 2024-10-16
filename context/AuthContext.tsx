// context/AuthContext.tsx
// "use server";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import instance from "@/utils/axios";
import API from "@/constants/APIs";
// import { cookies } from "next/headers";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
// import { useRouter } from "next/router";

type User = {
  id: string;
  username: string;
  role: "buyer" | "seller" | "approver";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const res = await instance.post(API.LOGIN, { username, password });
      console.log(res.data);
      const { token, user } = res.data;
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));
      // cookies().set("token", token, { expires: 7 });
      // Use js-cookie to set the token cookie
      Cookies.set("token", token, { expires: 1 });
      setUser(user);
      router.push(`/${user.role}/dashboard`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Failed to login", error);
      alert(JSON.stringify(axiosError.message));
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
