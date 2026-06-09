import api from "./api";

export const getImage = async (id_image: number) => {
  const token = localStorage.getItem("token");

  const res = await api.get("/post/getImage", {
    data: {
      id_image,
      token,
    },
  });

  return res.data;
};

export const addImage = async (id_post: number) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/post/addImage", {
    id_post,
    token,
  });

  return res.data;
};