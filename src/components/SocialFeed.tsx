import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat,
  Download,
  Share2,
  Sparkles,
  Send,
  Check,
  Filter,
  Flame,
  Zap,
} from "lucide-react";
import { SocialPost, CommentItem } from "../types";
import { playSound } from "../utils/audio";

interface SocialFeedProps {
  posts: SocialPost[];
  onLikePost: (postId: string) => void;
  onReactPost: (postId: string, emoji: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onGenerateAIComments: (postId: string) => Promise<void>;
  onSwitchToTriggers: () => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  onLikePost,
  onReactPost,
  onAddComment,
  onGenerateAIComments,
  onSwitchToTriggers,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingCommentsPostId, setLoadingCommentsPostId] = useState<string | null>(null);

  // Toggle comments
  const toggleComments = (postId: string) => {
    playSound("switch");
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Handle comment submit
  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    playSound("post-feed");
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // AI comments generator
  const handleAIComments = async (postId: string) => {
    playSound("switch");
    setLoadingCommentsPostId(postId);
    try {
      await onGenerateAIComments(postId);
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    } finally {
      setLoadingCommentsPostId(null);
    }
  };

  // Share / Copy link
  const handleShare = (post: SocialPost) => {
    playSound("switch");
    navigator.clipboard.writeText(
      `Check out this meme triggered by "${post.triggerLabel}":\n"${post.topText} - ${post.bottomText}"\n${window.location.href}`
    );
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download PNG
  const handleDownload = (post: SocialPost) => {
    if (!post.imageDataUrl) return;
    playSound("switch");
    const link = document.createElement("a");
    link.download = `social-meme-${post.id}.png`;
    link.href = post.imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "my-posts") return p.isCurrentUser;
    if (filterCategory === "dev") return p.triggerId.includes("deploy") || p.triggerId.includes("git") || p.triggerId.includes("machine") || p.triggerId.includes("chrome");
    if (filterCategory === "office") return p.triggerId.includes("meeting") || p.triggerId.includes("coffee") || p.triggerId.includes("sync") || p.triggerId.includes("email");
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Filter Controls */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-black">
              Live Social Feed
            </h2>
            <span className="border-2 border-black bg-red-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase animate-pulse shadow-[2px_2px_0px_0px_#000]">
              LIVE
            </span>
            <span className="border-2 border-black bg-yellow-400 text-black px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000] hidden sm:inline-block">
              {posts.length} Dank Posts
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-neutral-600 mt-1">
            Real-time feed spawned directly from interface chaos triggers
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Memes" },
            { id: "my-posts", label: "My Posts 👤" },
            { id: "dev", label: "Dev 💻" },
            { id: "office", label: "Office ☕" },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`feed-filter-${cat.id}`}
              onClick={() => {
                playSound("switch");
                setFilterCategory(cat.id);
              }}
              className={`border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-tight transition-all ${
                filterCategory === cat.id
                  ? "bg-black text-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Neo-Brutalist Global Analytics Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-black p-4 bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-3xl font-black text-black leading-none">94%</span>
          <span className="text-xs font-black uppercase tracking-wider text-black">Viral Rate</span>
        </div>
        <div className="border-2 border-black p-4 bg-purple-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-3xl font-black text-black leading-none">18.4k</span>
          <span className="text-xs font-black uppercase tracking-wider text-black">Dank Votes</span>
        </div>
        <div className="border-2 border-black p-4 bg-orange-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs font-black uppercase tracking-wider text-black mb-1">Trending Trigger</span>
          <span className="block text-sm sm:text-base font-black uppercase italic truncate text-black">
            "DEPLOY TO PROD ON FRIDAY"
          </span>
        </div>
      </div>

      {/* Feed Post List */}
      <div className="space-y-8">
        {filteredPosts.map((post) => {
          const isCommentsOpen = !!expandedComments[post.id];
          const isGeneratingComments = loadingCommentsPostId === post.id;

          return (
            <article
              key={post.id}
              id={`post-card-${post.id}`}
              className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Post Header: Author info & Trigger origin */}
              <div className="p-4 sm:p-5 border-b-2 border-black bg-white">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-yellow-400 text-black font-black text-xl shadow-[2px_2px_0px_0px_#000]">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black uppercase text-black">
                          {post.authorName}
                        </span>
                        {post.isCurrentUser && (
                          <span className="border border-black bg-yellow-400 px-2 py-0.2 text-[10px] font-black uppercase text-black">
                            YOU
                          </span>
                        )}
                        <span className="text-xs text-neutral-600 font-mono font-bold">
                          {post.authorHandle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-600">
                        <span>{post.createdAt}</span>
                        <span>•</span>
                        <span className="font-bold text-neutral-800">{post.authorBadge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Pill Badge */}
                  <div className="inline-flex items-center gap-1.5 border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-tight text-black shadow-[2px_2px_0px_0px_#000]">
                    <Zap className="h-3.5 w-3.5 fill-current text-black" />
                    <span className="truncate max-w-[180px] sm:max-w-[260px]">
                      {post.triggerLabel}
                    </span>
                  </div>
                </div>

                {/* Caption & Tags */}
                {post.caption && (
                  <p className="mt-3 text-sm font-bold text-black leading-relaxed">
                    {post.caption}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="border border-black bg-neutral-100 px-2 py-0.5 text-xs font-black uppercase tracking-tight text-black shadow-[1px_1px_0px_0px_#000]">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Meme Image Stage */}
              <div className="relative bg-neutral-100 flex items-center justify-center p-4 border-b-2 border-black">
                {post.imageDataUrl ? (
                  <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-1.5">
                    <img
                      id={`post-image-${post.id}`}
                      src={post.imageDataUrl}
                      alt={`${post.topText} ${post.bottomText}`}
                      className="w-full max-h-[520px] object-contain select-none"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs font-mono font-bold uppercase text-neutral-500">
                    Image preview unavailable
                  </div>
                )}
              </div>

              {/* Engagement Action Bar */}
              <div className="p-4 bg-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {/* Left: Like & Reaction emojis */}
                  <div className="flex items-center gap-2">
                    {/* Main Like Button */}
                    <button
                      id={`btn-like-${post.id}`}
                      onClick={() => {
                        playSound("like");
                        onLikePost(post.id);
                      }}
                      className={`flex items-center gap-1.5 border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                        post.hasLiked
                          ? "bg-red-500 text-white shadow-[3px_3px_0px_0px_#000]"
                          : "bg-white hover:bg-yellow-200 text-black shadow-[3px_3px_0px_0px_#000]"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.hasLiked ? "fill-current text-white" : "text-black"}`} />
                      <span>{post.likes}</span>
                    </button>

                    {/* Quick Reactions */}
                    <div className="hidden sm:flex items-center gap-1">
                      {[
                        { emoji: "😂", label: "Joy" },
                        { emoji: "💀", label: "Dead" },
                        { emoji: "🔥", label: "Fire" },
                        { emoji: "🚀", label: "Ship it" },
                        { emoji: "🤦‍♂️", label: "Facepalm" },
                      ].map((item) => {
                        const count = post.reactionCounts[item.emoji] || 0;
                        const isSelected = post.userReaction === item.emoji;
                        return (
                          <button
                            key={item.emoji}
                            id={`btn-react-${post.id}-${item.emoji}`}
                            onClick={() => {
                              playSound("like");
                              onReactPost(post.id, item.emoji);
                            }}
                            title={item.label}
                            className={`flex items-center gap-1 border-2 border-black px-2 py-1 text-xs font-black transition-all ${
                              isSelected
                                ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]"
                                : "bg-white hover:bg-neutral-100 text-black shadow-[2px_2px_0px_0px_#000]"
                            }`}
                          >
                            <span>{item.emoji}</span>
                            {count > 0 && <span className="text-[10px] font-mono">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Comments, Download, Share */}
                  <div className="flex items-center gap-2">
                    {/* Comments Toggle */}
                    <button
                      id={`btn-comments-toggle-${post.id}`}
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 border-2 border-black bg-white hover:bg-yellow-200 px-3 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    {/* Download PNG */}
                    <button
                      id={`btn-download-post-${post.id}`}
                      onClick={() => handleDownload(post)}
                      title="Download PNG"
                      className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {/* Share Button */}
                    <button
                      id={`btn-share-post-${post.id}`}
                      onClick={() => handleShare(post)}
                      title="Share link"
                      className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {copiedId === post.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile reactions row */}
                <div className="flex sm:hidden items-center gap-1.5 pt-1">
                  {["😂", "💀", "🔥", "🚀", "🤦‍♂️"].map((emoji) => {
                    const count = post.reactionCounts[emoji] || 0;
                    const isSelected = post.userReaction === emoji;
                    return (
                      <button
                        key={emoji}
                        onClick={() => {
                          playSound("like");
                          onReactPost(post.id, emoji);
                        }}
                        className={`flex items-center gap-1 border-2 border-black px-2 py-1 text-xs font-black ${
                          isSelected ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]" : "bg-white text-black shadow-[2px_2px_0px_0px_#000]"
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span className="text-[10px] font-mono">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expandable Comments Section */}
              {isCommentsOpen && (
                <div className="border-t-4 border-black bg-yellow-50 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black">
                      Comments ({post.comments.length})
                    </h4>
                    {/* Generate AI Follower Comments */}
                    <button
                      id={`btn-ai-comments-${post.id}`}
                      onClick={() => handleAIComments(post.id)}
                      disabled={isGeneratingComments}
                      className="flex items-center gap-1.5 border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase text-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-800 disabled:opacity-50 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <Sparkles className={`h-3 w-3 ${isGeneratingComments ? "animate-spin" : ""}`} />
                      <span>{isGeneratingComments ? "Spawning AI Followers..." : "Spawn AI Follower Roasts"}</span>
                    </button>
                  </div>

                  {/* Comment Thread */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start gap-2.5 border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs"
                      >
                        <span className="text-xl border border-black bg-yellow-200 p-1">{comment.avatarEmoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black uppercase text-black">
                              {comment.userName}{" "}
                              <span className="font-normal font-mono text-neutral-600">
                                {comment.userHandle}
                              </span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-neutral-600">
                              {comment.timeAgo}
                            </span>
                          </div>
                          <p className="mt-1 font-bold text-black leading-relaxed">
                            {comment.commentText}
                          </p>
                        </div>
                      </div>
                    ))}

                    {post.comments.length === 0 && (
                      <p className="text-center text-xs font-black uppercase text-neutral-500 py-3">
                        No comments yet. Be the first to roast this meme!
                      </p>
                    )}
                  </div>

                  {/* Add User Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id={`input-comment-${post.id}`}
                      type="text"
                      placeholder="Add a witty reply..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommentSubmit(post.id);
                      }}
                      className="flex-1 border-2 border-black bg-white px-3.5 py-2 text-xs font-bold uppercase text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    />
                    <button
                      id={`btn-submit-comment-${post.id}`}
                      onClick={() => handleCommentSubmit(post.id)}
                      className="flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow-400 text-black font-black hover:bg-yellow-300 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="border-4 border-black bg-white p-12 text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-black bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000]">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-black">No memes found in this filter</h3>
              <p className="text-xs font-bold text-neutral-600 mt-1 max-w-sm mx-auto">
                Interact with triggers in the Triggers tab to spawn new memes and post them directly here!
              </p>
            </div>
            <button
              id="btn-feed-goto-triggers"
              onClick={onSwitchToTriggers}
              className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Zap className="h-4 w-4" />
              <span>Go to Interface Triggers</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
