import axios from "axios";

const instance = axios.create({
  baseURL: "https://market-place-backend-kb1j.onrender.com/api",
});

export default instance;
