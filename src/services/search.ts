import api from "./api";

export const search = async (input: string) => {
  const res = await api.get("/search/search", {
    params: { input },
  });
  return res.data;
};