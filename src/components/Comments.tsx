import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getComments,
  createComment,
  deleteComment,
  reactToComment,
  getComment,
} from "../services/comments";

const reactionMap: any = {
  like: "👍",
  love: "❤️",
  care: "🤗",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
};

export default function Comments({ id_post, postUserId }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [replies, setReplies] = useState<any>({});
  const [content, setContent] = useState("");
  const [myReactions, setMyReactions] = useState<any>({});
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const myId = localStorage.getItem("user_id");
  const navigate = useNavigate();


  const load = async () => {
    const res = await getComments(id_post);
    setComments(res || []);

    const repliesMap: any = {};
    for (let c of res || []) {
      try {
        const full = await getComment(c.id_comment);
        repliesMap[c.id_comment] = full.children || [];
      } catch (err) {
        console.error(err);
      }
    }
    setReplies(repliesMap);
  };

  useEffect(() => {
    load();
  }, [id_post]);

  const handleAdd = async () => {
    console.log("CLICK WORKS 🔥");
    if (!content.trim()) return;

    if (replyTo) {
      await createComment({
        id_post,
        content,
      });
    } else {
      await createComment({
        id_post,
        content,
      });
    }

    setContent("");
    setReplyTo(null);
    load();
  };

  const handleDelete = async (id_comment: number) => {
    if (!confirm("Delete comment?")) return;
    await deleteComment(id_comment);
    load();
  };

  const handleReaction = async (id_comment: number, reaction: string) => {
    await reactToComment(id_comment, reaction);
    setMyReactions((prev: any) => ({
      ...prev,
      [id_comment]: prev[id_comment] === reaction ? null : reaction,
    }));
  };

  const CommentItem = ({ c, isReply = false }: { c: any; isReply?: boolean }) => {

    const localName = localStorage.getItem(`name_${c.id_user}`);
    const localSurname = localStorage.getItem(`surname_${c.id_user}`);

    return (
      <div className={`p-2 rounded ${isReply ? "bg-gray-200" : "bg-gray-100"}`}>

        {/* AUTHOR */}
        <div className="flex items-center gap-2">
          <img
            src={localStorage.getItem(`avatar_${c.id_user}`) || "https://via.placeholder.com/30"}
            className={`${isReply ? "w-5 h-5" : "w-6 h-6"} rounded-full`}
            alt=""
          />

          <p className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${c.id_user}`)}>
            {localName || localSurname
              ? `${localName || ""} ${localSurname || ""}`.trim()
              : `User ${c.id_user}`}

            {c.id_user === postUserId && (
              <span className="ml-1 text-gray-500">• author</span>
            )}
          </p>
        </div>

        {/* CONTENT */}
        <p className="text-sm mt-1">{c.content}</p>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-2 text-xs flex-wrap">
          <button onClick={() => setReplyTo(c.id_comment)}>💬 Reply</button>
          {String(c.id_user) === myId && (
            <button onClick={() => handleDelete(c.id_comment)}>
              🗑️
            </button>
          )}
          {Object.keys(reactionMap).map((r) => (
            <button
              key={r}
              onClick={() => handleReaction(c.id_comment, r)}
              className={`px-1 rounded ${myReactions[c.id_comment] === r ? "bg-blue-200" : ""}`}
            >
              {reactionMap[r]}
            </button>
          ))}
        </div>
      </div >
    );
  }
  return (
    <div className="mt-2">
      <div className="space-y-3">
        {comments
          .filter((c) => !c.id_comment_replied_to)
          .map((c) => (
            <div key={c.id_comment}>
              <CommentItem c={c} />

              {/* REPLIES */}
              <div className="ml-6 mt-1 space-y-2 border-l pl-2">
                {(replies[c.id_comment] || []).map((child: any) => (
                  <CommentItem key={child.id_comment} c={child} isReply />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* REPLY INFO */}
      {replyTo && (
        <div className="text-xs text-gray-500 mt-2">
          Replying to comment #{replyTo}
          <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500">
            cancel
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2 mt-2">
        <input
          className="border p-1 flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write comment..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {replyTo ? "Reply" : "Add"}
        </button>
      </div>
    </div>
  );
}