import api from "./api";

export const register = async (data: {
  login: string;
  email: string;
  password: string;
  repeat_password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  login?: string;
  email?: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const token = localStorage.getItem("token");

  const res = await api.delete("/auth/deleteToken", {
    data: { token }, // 🔥 KLUCZ
  });

  return res.data;
};

