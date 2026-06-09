import { useState } from "react";
import { createPost } from "../services/createPost";
import { addImage } from "../services/images";
import { addVideo } from "../services/videos";

export default function CreatePost({ onCreated }: any) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const avatar = localStorage.getItem("avatar_me");

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleVideo = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedVideo({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage && !selectedVideo) return;

    setLoading(true);

    try {
      const res = await createPost(content);

      if (selectedImage) {
        await addImage(res.id_post);
      }

      if (selectedVideo) {
        await addVideo(res.id_post);
      }

      setContent("");
      setSelectedImage(null);
      setSelectedVideo(null);

      onCreated?.();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white p-4 shadow rounded mb-4">


      <textarea
        placeholder="What's on your mind?"
        className="border p-2 w-full mb-3 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* PREVIEW */}
      {selectedImage && (
        <img src={selectedImage.preview} className="max-h-60 mb-2 rounded" />
      )}

      {selectedVideo && (
        <video src={selectedVideo.preview} controls className="max-h-60 mb-2 rounded" />
      )}

      {/* ACTION BAR */}
      <div className="flex gap-4 items-center text-xl">

        <label className="cursor-pointer">
          📷
          <input type="file" accept="image/*" onChange={handleImage} hidden />
        </label>

        <label className="cursor-pointer">
          🎥
          <input type="file" accept="video/*" onChange={handleVideo} hidden />
        </label>



        <button onClick={handlePost} className="ml-auto bg-blue-500 text-white px-3 py-1 rounded">
          Post
        </button>

      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={handlePost}
          disabled={!content.trim() || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}