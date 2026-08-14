import axios from "axios";

const api = axios.create({
  baseURL: "https://lumina-ai-backend-qyoi.onrender.com/api",
});

export default api;
