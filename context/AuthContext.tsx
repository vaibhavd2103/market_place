// context/AuthContext.tsx
// "use server";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import instance from "@/utils/axios";
import API from "@/constants/APIs";
// import { cookies } from "next/headers";
import Cookies from "js-cookie";
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
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // fetch user info based on token
  //     axios
  //       .get("/api/auth/me", {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => setUser(res.data.user))
  //       .catch(() => {
  //         localStorage.removeItem("token");
  //       });
  //   }
  // }, []);

  //   useEffect(() => {
  //     // Check if the user is authenticated on mount
  //     const checkAuth = async () => {
  //       try {
  //         await axios.get('http://localhost:5000/api/buyer/products', {
  //           withCredentials: true, // Important to send cookies with requests
  //         });
  //         setIsAuthenticated(true);
  //       } catch (error) {
  //         setIsAuthenticated(false);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     checkAuth();
  //   }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await instance.post(API.LOGIN, { username, password });
      console.log(res.data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // cookies().set("token", token, { expires: 7 });
      // Use js-cookie to set the token cookie
      Cookies.set("token", token, { expires: 1 });
      setUser(user);
      router.push(`/${user.role}/dashboard`);
    } catch (error) {
      console.error("Failed to login", error);
      alert(JSON.stringify(error.message));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
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
