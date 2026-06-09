import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserProfile } from "../services/user";
import { getUserPosts, getPost } from "../services/posts";
import Post from "../components/Post";

export default function Profile() {
    const { id_user } = useParams();
    const navigate = useNavigate();

    const userId = Number(id_user);
    const myId = localStorage.getItem("user_id");

    useEffect(() => {
        if (!id_user || isNaN(userId)) {
            const stored = localStorage.getItem("user_id");

            if (stored) {
                navigate(`/profile/${stored}`);
            } else {
                console.warn("No user_id anywhere");
            }
        }
    }, [id_user]);


    useEffect(() => {
        const stored = localStorage.getItem("user_id");

        if (!stored && userId && !isNaN(userId)) {
            console.log("SET MY USER ID:", userId);
            // localStorage.setItem("user_id", String(userId));
        }
    }, [userId]);



    console.log("PROFILE DEBUG:", userId);

    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>("");

    const [cover, setCover] = useState<string | null>(
        localStorage.getItem(`cover_${userId}`)
    );


    const loadUser = async () => {
        if (!userId || isNaN(userId)) return;

        try {
            const u = await getUserProfile(userId);

            console.log("PROFILE:", u);

            setUser(u || {});

            const localName = localStorage.getItem(`name_${userId}`);
            const localSurname = localStorage.getItem(`surname_${userId}`);

            setDisplayName(
                localName || localSurname
                    ? `${localName || ""} ${localSurname || ""}`.trim()
                    : u?.name || u?.surname
                        ? `${u.name || ""} ${u.surname || ""}`.trim()
                        : `User ${userId}`
            );

        } catch (err) {
            console.error("USER ERROR:", err);

            setUser({});

            setDisplayName(`User ${userId}`);
        }
    };

    const loadPosts = async () => {
        if (userId === null || isNaN(userId)) return;

        if (!userId || isNaN(userId)) {
            console.warn("NO VALID ID:", userId);
        }
        try {
            const postIds = await getUserPosts(userId);

            const results = await Promise.allSettled(
                (postIds || []).map((id: number) => getPost(id))
            );

            const loadedPosts = results
                .filter((r) => r.status === "fulfilled")
                .map((r: any) => r.value);

            setPosts(loadedPosts);
        } catch (err) {
            console.error("POST LIST ERROR:", err);
        }
    };

    useEffect(() => {
        if (!userId || isNaN(userId)) return;


        const savedAvatar = localStorage.getItem(`avatar_${userId}`);
        if (savedAvatar) {
            setAvatar(savedAvatar);
        }


        loadUser();
        loadPosts();
    }, [userId]);

    useEffect(() => {
        const saved = localStorage.getItem(`cover_${userId}`);
        setCover(saved);
    }, [userId]);

    const handleAvatarChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file || userId === null) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setAvatar(base64);

            localStorage.setItem(`avatar_${userId}`, base64);
        };
        reader.readAsDataURL(file);
    };


    const handleCover = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);

        setCover(preview);

        localStorage.setItem(`cover_${userId}`, preview);
    };

    if (!userId || isNaN(userId)) {
        const stored = localStorage.getItem("user_id");

        if (stored) {
            navigate(`/profile/${stored}`);
            return null;
        }

        return (
            <div className="p-4 text-center text-red-500">
                No user ID yet — open your profile from a post first
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4 text-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            {/* COVER + AVATAR */}
            <div className="relative mb-4">

                {/* ✅ COVER */}
                <div className="h-48 rounded overflow-hidden bg-blue-500">
                    {cover && (
                        <img
                            src={cover}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* ✅ BUTTON */}
                {String(userId) === localStorage.getItem("user_id") && (
                    <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded shadow cursor-pointer">
                        Change cover
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCover}
                            hidden
                        />
                    </label>
                )}

                {/* ✅ AVATAR */}
                <div className="absolute -bottom-14 left-8">
                    <label className="cursor-pointer group relative">

                        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-300">
                            {avatar && (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded-full">
                            Change
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </label>
                </div>

            </div>

            {/* HEADER */}
            <div className="pl-40 pt-4 pb-4 bg-white shadow">
                <p className="text-2xl font-bold">{displayName}</p>

                {String(userId) === myId && (
                    <button
                        onClick={() => navigate(`/edit-profile/${userId}`)}
                        className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* CONTENT */}
            <div className="max-w-5xl mx-auto mt-4 flex gap-4">

                {/* ABOUT */}
                <div className="w-1/3 bg-white p-4 rounded shadow">
                    <h2 className="font-bold mb-2">About</h2>

                    <p className="text-sm">🎓 {user.education || "No education"}</p>
                    <p className="text-sm">💼 {user.work || "No work"}</p>
                    <p className="text-sm">🏡 {user.hometown || "No hometown"}</p>
                    <p className="text-sm">📍 {user.current_place || "No current place"}</p>
                    <p className="text-sm">❤️ {user.relationship_status || "No status"}</p>

                    {user.date_of_birth && (
                        <p className="text-sm">🎂 {user.date_of_birth}</p>
                    )}
                </div>

                {/* POSTS */}
                <div className="flex-1 space-y-4">
                    {posts.length === 0 ? (
                        <div className="bg-white p-4 rounded shadow text-gray-500">
                            No posts yet
                        </div>
                    ) : (
                        posts.map((post: any) => (
                            <Post
                                key={post.id_post}
                                post={post}
                                onChange={loadPosts}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
