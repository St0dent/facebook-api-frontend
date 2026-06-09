import api from "./api";

export const createPost = async (content: string) => {
  const res = await api.post("/post/createPost", {
    content,
    token: localStorage.getItem("token"),
  });

  return res.data;
};