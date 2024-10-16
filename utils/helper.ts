import Cookies from "js-cookie";

export function GetUser() {
  const user = JSON.parse(String(localStorage.getItem("user")));
  return user;
}

export function GetToken() {
  // const token = localStorage.getItem("token");
  const token = Cookies.get("token");
  return token;
}
