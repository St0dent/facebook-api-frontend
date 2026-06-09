import { useEffect, useState } from "react";
import { reactToPost, deletePost, editPost } from "../services/posts";
import { getImage, addImage } from "../services/images";
import { getVideo, addVideo } from "../services/videos";
import { getUserProfile } from "../services/user";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";

const reactionMap: any = {
    like: "👍",
    love: "❤️",
    care: "🤗",
    haha: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡",
};

export default function Post({ post, onChange }: any) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [newContent, setNewContent] = useState(post.content);
    const [authorName, setAuthorName] = useState<string>("");
    const [reactions, setReactions] = useState(post.post_reactions || []);
    const [myReaction, setMyReaction] = useState<string | null>(null);

    const navigate = useNavigate();
    const userId = post.id_user;
    const myId = localStorage.getItem("user_id");

    String(post.id_user) === myId
    console.log("POST CHECK:", {
        postOwner: post.id_user,
        myId,
    });

    useEffect(() => {
        setReactions(post.post_reactions || []);
    }, [post]);

    useEffect(() => {
        const loadMedia = async () => {
            try {
                const imgs = await Promise.all(
                    (post.images || []).map((id: number) => getImage(id))
                );
                const vids = await Promise.all(
                    (post.videos || []).map((id: number) => getVideo(id))
                );
                setImages(imgs);
                setVideos(vids);
            } catch (err) {
                console.error(err);
            }
        };

        loadMedia();
    }, [post]);

    useEffect(() => {
        if (!userId) return;

        const localName = localStorage.getItem(`name_${userId}`);
        const localSurname = localStorage.getItem(`surname_${userId}`);

        const loadAuthor = async () => {
            try {
                const localName = localStorage.getItem(`name_${userId}`);
                const localSurname = localStorage.getItem(`surname_${userId}`);

                if (localName || localSurname) {
                    setAuthorName(
                        `${localName || ""} ${localSurname || ""}`.trim()
                    );
                    return;
                }

                const profile = await getUserProfile(userId);

                if (profile.name || profile.surname) {
                    setAuthorName(
                        `${profile.name || ""} ${profile.surname || ""}`.trim()
                    );
                } else {
                    setAuthorName(`User ${userId}`);
                }
            } catch {
                setAuthorName(`User ${userId}`);
            }
        };

        loadAuthor();
    }, [userId]);

    const handleReaction = async (reaction: string) => {
        try {
            let updated = [...reactions];

            // ✅ klik tej samej reakcji → usuń
            if (myReaction === reaction) {
                updated = updated.map((r: any) =>
                    r.type === reaction
                        ? { ...r, count: Math.max(0, r.count - 1) }
                        : r
                );

                setMyReaction(null);

            } else {
                // ✅ zmień starą reakcję
                if (myReaction) {
                    updated = updated.map((r: any) =>
                        r.type === myReaction
                            ? { ...r, count: Math.max(0, r.count - 1) }
                            : r
                    );
                }

                // ✅ dodaj nową
                let found = false;

                updated = updated.map((r: any) => {
                    if (r.type === reaction) {
                        found = true;
                        return { ...r, count: r.count + 1 };
                    }
                    return r;
                });

                if (!found) {
                    updated.push({ type: reaction, count: 1 });
                }

                setMyReaction(reaction);
            }

            setReactions(updated);

            await reactToPost(post.id_post, reaction);

        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete post?")) return;
        await deletePost(post.id_post);
        onChange?.(); // 🔥 ważne
    };

const handleEdit = async () => {
    try {
        await editPost(post.id_post, newContent);

        if (selectedImage) {
            await addImage(post.id_post);
        }

        if (selectedVideo) {
            await addVideo(post.id_post);
        }

        setSelectedImage(null);
        setSelectedVideo(null);

        setEditing(false);
        onChange?.();

    } catch (err: any) {
        console.log(err?.response?.data || err);
    }
};

const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
};

const handleVideo = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedVideo(URL.createObjectURL(file));
};

    const handleAddMedia = async () => {
        try {
            if (selectedImage) {
                await addImage(post.id_post);
            }

            if (selectedVideo) {
                await addVideo(post.id_post);
            }

            setSelectedImage(null);
            setSelectedVideo(null);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setNewContent(post.content);
    }, [post]);

    return (
        <div className="bg-white rounded shadow p-4 mb-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/profile/${post.id_user}`)}
                >
                    <img
                        src={
                            localStorage.getItem(`avatar_${userId}`) ||
                            "https://via.placeholder.com/40"
                        }
                        className="w-8 h-8 rounded-full"
                        alt=""
                    />

                    <div>
                        <p className="font-semibold text-blue-600">{authorName}</p>
                        <p className="text-xs text-gray-500">
                            {post.date_created
                                ? new Date(post.date_created).toLocaleDateString()
                                : ""}
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                    {String(post.id_user) === myId && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditing(!editing)}
                                className="text-blue-500 hover:underline text-sm"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:underline text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            {editing ? (
                <div className="mb-3">

                    {/* TEXT */}
                    <textarea
                        className="border p-2 w-full"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />

                    {/* IMAGE PREVIEW */}
                    {selectedImage && (
                        <div className="relative mt-2">
                            <img
                                src={selectedImage.preview}
                                className="max-h-60 rounded"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-1 right-1 bg-white px-2 rounded"
                            >
                                ✖
                            </button>
                        </div>
                    )}

                    {/* VIDEO PREVIEW */}
                    {selectedVideo && (
                        <div className="relative mt-2">
                            <video
                                src={selectedVideo.preview}
                                controls
                                className="max-h-60 rounded"
                            />
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-1 right-1 bg-white px-2 rounded"
                            >
                                ✖
                            </button>
                        </div>
                    )}

                    {/* ACTION BAR */}
                    <div className="flex gap-4 items-center mt-2 text-xl">

                        <label className="cursor-pointer">
                            📷
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                hidden
                            />
                        </label>

                        <label className="cursor-pointer">
                            🎥
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideo}
                                hidden
                            />
                        </label>

                        <button
                            onClick={handleEdit}
                            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Save
                        </button>

                    </div>

                </div>
            ) : (
                <p className="mb-3">{post.content}</p>
            )}

            {/* IMAGES */}
            {images.map((img, i) => (
                <img
                    key={i}
                    src={`http://localhost:3000${img.path}`}
                    className="w-full rounded mb-2"
                />
            ))}

            {/* VIDEOS */}
            {videos.map((vid, i) => (
                <video key={i} controls className="w-full mb-2">
                    <source src={`http://localhost:3000${vid.path}`} />
                </video>
            ))}

            {/* REACTIONS */}
            <div className="flex gap-3 border-t pt-2 mb-2 text-xl">
                {Object.keys(reactionMap).map((r) => (
                    <button
                        key={r}
                        onClick={() => handleReaction(r)}
                        disabled={loading}
                        className={`hover:scale-125 transition ${myReaction === r ? "bg-blue-200 rounded" : ""
                            }`}

                    >
                        {reactionMap[r]}
                    </button>
                ))}
            </div>

            {/* COUNTS */}
            <div className="text-sm text-gray-500 mt-1">
                {reactions.map(
                    (r: any, i: number) =>
                        r.count > 0 && (
                            <span key={i} className="mr-2">
                                {reactionMap[r.type]} {r.count}
                            </span>
                        )
                )}
            </div>

            {/* COMMENTS */}
            <Comments id_post={post.id_post} postUserId={userId} />
        </div>
    );
}