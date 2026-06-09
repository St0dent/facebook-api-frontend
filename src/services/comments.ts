import api from "./api";

export const getComments = async (id_post: number) => {
    const res = await api.get("/post/comments/getComments", {
        params: { id_post },
    });
    return res.data.comments;
};

export const getComment = async (id_comment: number) => {
    const res = await api.get("/post/comments/getComment", {
        params: { id_comment },
    });
    return res.data;
};

export const createComment = async ({
    id_post,
    content,
    id_comment_replied_to,
}: {
    id_post: number;
    content: string;
    id_comment_replied_to?: number;
}) => {
    const res = await api.post("/post/comments/createComment", {
        id_post,
        content,
        id_comment_replied_to,
    });
    return res.data;
};
export const deleteComment = async (id_comment: number) => {
    const res = await api.delete("/post/comments/deleteComment", {
        data: { id_comment },
    });
    return res.data;
};

export const reactToComment = async (id_comment: number, reaction: string) => {
    const res = await api.post("/post/comments/changeCommentReactions", {
        id_comment,
        reaction,
    });
    return res.data;
};