import api from "./api";

export const getVideo = async (id_video: number) => {
  const token = localStorage.getItem("token");

  const res = await api.get("/post/getVideo", {
    data: {
      id_video,
      token,
    },
  });

  return res.data;
};

export const addVideo = async (id_post: number) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/post/addVideo", {
    id_post,
    token,
  });

  return res.data;
};
``