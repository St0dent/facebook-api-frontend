import api from "./api";

export const getFeed = async () => {
  const { data } = await api.get("/search/postsFeed");
  return data;
};

export const getPost = async (id_post: number) => {
  const res = await api.get("/post/getPost", {
    params: { id_post },
  });
  return { ...res.data, id_post };
};

export const getUserPosts = async (id_user: number) => {
  const res = await api.get("/search/postsUser", {
    params: { id_user },
  });
  return res.data;
};

export const reactToPost = async (id_post: number, reaction: string) => {
  const res = await api.post("/post/changePostReactions", { id_post, reaction });
  return res.data;
};

export const deletePost = async (id_post: number) => {
  const res = await api.delete("/post/deletePost", { data: { id_post } });
  return res.data;
};

export const editPost = async (id_post: number, new_content: string) => {
  const res = await api.post("/post/editPostContent", { id_post, new_content });
  return res.data;
};