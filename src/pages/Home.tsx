import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";
import { getFeed, getPost } from "../services/posts";

export default function Home() {
  const [ids, setIds] = useState<number[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [visible, setVisible] = useState(3);
  const [loading, setLoading] = useState(false);

  const loadFeed = async () => {
    try {
      const data = await getFeed();
      setIds(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPosts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const slice = ids.slice(0, visible);

      const results = await Promise.all(
        slice.map((id) => getPost(id))
      );

      setPosts(results);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    if (ids.length) {
      loadPosts();
    }
  }, [visible, ids]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setVisible((prev) => prev + 3);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addNewPost = async (id_post: number) => {
    try {
      const newPost = await getPost(id_post);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const reload = () => {
    loadPosts();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex justify-center">
        <div className="w-full max-w-xl mt-4">

          <CreatePost onCreated={addNewPost} />

          {posts.map((p) => (
            <Post key={p.id_post} post={p} onChange={reload} />
          ))}

          {loading && (
            <div className="text-center p-4 text-gray-500">
              Loading...
            </div>
          )}

        </div>
      </div>
    </div>
  );
}