"use client";

import Cookies from "js-cookie";

export function GetUser() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(String(window.localStorage.getItem("user")))
      : JSON.parse(String(Cookies.get("user")));
  return user;
}

export function GetToken() {
  // const token = localStorage.getItem("token");
  const token = Cookies.get("token");
  return token;
}
