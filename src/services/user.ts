import api from "./api";
import { getFeed, getPost } from "./posts";


export const getUserProfile = async (id_user: number) => {
  const res = await api.get("/user/userProfile", {
    params: { id_user },
  });
  return res.data;
};

export const changeWork = async (value: string) => {
  const { data } = await api.post("/user/changeWork", {
    new_work: value,
  });
  return data;
};

export const changeEducation = (value: string) =>
  api.post("/user/changeEducation", { new_education: value });

export const changeHometown = (value: string) =>
  api.post("/user/changeHometown", { new_hometown: value });

export const changeCurrentPlace = (value: string) =>
  api.post("/user/changeCurrentPlace", { new_current_place: value });

export const changeRelationshipStatus = (value: string) =>
  api.post("/user/changeRelationshipStatus", { new_relationship_status: value });

export const changeName = (value: string) =>
  api.post("/user/changeName", { new_name: value });

export const changeSurname = (value: string) =>
  api.post("/user/changeSurname", { new_surname: value });


export const findMyUserId = async () => {
  const ids = await getFeed();

  for (const postId of ids) {
    try {
      const post = await getPost(postId);


      return post.id_user;
    } catch {}
  }

  return null;
};


export const getMyUserIdFromToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const res = await api.post("/user/userProfile", {
      token,
      id_user: 1
    });

    return token; 

  } catch (err) {
    console.error(err);
    return null;
  }
}