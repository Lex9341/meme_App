import React, { useState } from "react";
import {
  User,
  Award,
  Flame,
  Grid,
  List,
  Pin,
  Heart,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  Edit3,
  Check,
  Zap,
} from "lucide-react";
import { SocialPost, UserProfile } from "../types";
import { playSound } from "../utils/audio";

interface ProfilePageProps {
  profile: UserProfile;
  userPosts: SocialPost[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onPinPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onSwitchToTriggers: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  userPosts,
  onUpdateProfile,
  onPinPost,
  onDeletePost,
  onSwitchToTriggers,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [bioInput, setBioInput] = useState(profile.bio);

  const handleSaveBio = () => {
    playSound("switch");
    onUpdateProfile({ name: nameInput, bio: bioInput });
    setIsEditingBio(false);
  };

  const totalLikes = userPosts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = userPosts.reduce((acc, p) => acc + p.comments.length, 0);

  const pinnedPost = userPosts.find((p) => p.id === profile.pinnedMemeId);
  const unpinnedPosts = userPosts.filter((p) => p.id !== profile.pinnedMemeId);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Banner */}
        <div className="h-32 sm:h-36 bg-yellow-400 border-b-4 border-black relative flex items-center justify-between px-6">
          <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black opacity-30 select-none hidden sm:block">
            AUTHENTIC MEME CREATOR
          </span>
          <div className="absolute top-4 right-4 flex items-center gap-2 border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase text-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Flame className="h-3.5 w-3.5 fill-current text-yellow-400" />
            <span>Viral Karma: {totalLikes * 12 + profile.viralKarma}</span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-12 mb-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center border-4 border-black bg-white text-4xl sm:text-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {profile.avatarEmoji}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    {profile.name}
                  </h1>
                  <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                    TOP SHITPOSTER
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-neutral-600">{profile.handle}</p>
              </div>
            </div>

            {/* Edit / Action button */}
            <div>
              {isEditingBio ? (
                <button
                  id="btn-save-profile"
                  onClick={handleSaveBio}
                  className="flex items-center gap-1.5 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-4 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Profile</span>
                </button>
              ) : (
                <button
                  id="btn-edit-profile"
                  onClick={() => setIsEditingBio(true)}
                  className="flex items-center gap-1.5 border-2 border-black bg-white hover:bg-yellow-100 px-4 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio section */}
          {isEditingBio ? (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-black uppercase text-black">Display Name</label>
                <input
                  id="input-edit-profile-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 w-full max-w-sm border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-black">Bio</label>
                <textarea
                  id="input-edit-profile-bio"
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-bold text-black max-w-2xl leading-relaxed mt-1">
              {profile.bio}
            </p>
          )}

          {/* Metadata chips */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono font-bold uppercase text-neutral-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-black" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-black" />
              <span>Joined {profile.joinedDate}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t-2 border-black pt-5">
            <div className="border-2 border-black bg-white p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl sm:text-3xl font-black text-black leading-none block">
                {userPosts.length}
              </span>
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-600 mt-1">Memes Spawned</p>
            </div>

            <div className="border-2 border-black bg-rose-100 p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl sm:text-3xl font-black text-red-600 leading-none block">
                {totalLikes}
              </span>
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-700 mt-1">Likes Scored</p>
            </div>

            <div className="border-2 border-black bg-sky-100 p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl sm:text-3xl font-black text-sky-800 leading-none block">
                {totalComments}
              </span>
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-700 mt-1">Discussions</p>
            </div>

            <div className="border-2 border-black bg-yellow-100 p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl sm:text-3xl font-black text-black leading-none block">
                {profile.unlockedBadges.length}
              </span>
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-700 mt-1">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-black" />
            <h3 className="text-sm font-black uppercase tracking-wider text-black">
              Achievements & Trigger Badges
            </h3>
          </div>
          <span className="text-xs font-mono font-black uppercase text-neutral-600">
            {profile.unlockedBadges.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profile.unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-2.5 border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-2xl border border-black bg-yellow-200 p-1 shadow-[1px_1px_0px_0px_#000]">{badge.icon}</span>
              <div>
                <h4 className="text-xs font-black uppercase text-black leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[10px] font-semibold text-neutral-600 mt-0.5 leading-snug">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Header & Controls */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black">My Meme Gallery</h3>
          <span className="border border-black bg-yellow-400 px-2 py-0.5 text-xs font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
            {userPosts.length}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border-2 border-black bg-white p-1 shadow-[2px_2px_0px_0px_#000]">
          <button
            id="btn-view-grid"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 transition-colors ${
              viewMode === "grid" ? "bg-black text-yellow-400" : "text-black hover:bg-neutral-100"
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            id="btn-view-list"
            onClick={() => setViewMode("list")}
            className={`p-1.5 transition-colors ${
              viewMode === "list" ? "bg-black text-yellow-400" : "text-black hover:bg-neutral-100"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pinned Meme Spotlight (if any) */}
      {pinnedPost && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
            <Pin className="h-4 w-4 fill-black text-black" />
            <span>Pinned Showcase Meme</span>
          </div>

          <div className="border-4 border-black bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-white flex items-center justify-center p-3 border-b-4 md:border-b-0 md:border-r-4 border-black">
              <img
                src={pinnedPost.imageDataUrl}
                alt="Pinned Meme"
                className="max-h-72 object-contain border-2 border-black shadow-[3px_3px_0px_0px_#000]"
              />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 border-2 border-black bg-black px-2.5 py-1 text-xs font-black uppercase text-yellow-400 shadow-[2px_2px_0px_0px_#000]">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>{pinnedPost.triggerLabel}</span>
                </div>
                <h4 className="mt-3 text-lg font-black uppercase tracking-tight text-black leading-snug">
                  "{pinnedPost.caption || `${pinnedPost.topText} - ${pinnedPost.bottomText}`}"
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pinnedPost.tags.map((t, idx) => (
                    <span key={idx} className="border border-black bg-white px-2 py-0.5 text-xs font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t-2 border-black pt-3 text-xs font-black uppercase text-black">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-red-600">
                    <Heart className="h-4 w-4 fill-current" />
                    {pinnedPost.likes}
                  </span>
                  <span className="flex items-center gap-1 text-black">
                    <MessageCircle className="h-4 w-4" />
                    {pinnedPost.comments.length}
                  </span>
                </div>

                <button
                  id="btn-unpin-post"
                  onClick={() => onPinPost(pinnedPost.id)}
                  className="border border-black bg-white px-2 py-1 text-xs font-black uppercase text-black hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Unpin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid or List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {unpinnedPosts.map((post) => (
            <div
              key={post.id}
              id={`profile-grid-item-${post.id}`}
              className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Image */}
              <div className="aspect-square bg-neutral-100 flex items-center justify-center p-2 border-b-2 border-black">
                <img
                  src={post.imageDataUrl}
                  alt="User Meme"
                  className="w-full h-full object-cover border border-black"
                />
              </div>

              {/* Info & actions */}
              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase text-black truncate max-w-[140px]">
                    {post.triggerLabel}
                  </span>
                  <div className="flex items-center gap-2 text-black font-black">
                    <span className="flex items-center gap-0.5 text-red-600">
                      <Heart className="h-3 w-3 fill-current" />
                      {post.likes}
                    </span>
                    <button
                      onClick={() => onPinPost(post.id)}
                      title="Pin to top of profile"
                      className="border border-black p-1 bg-yellow-400 hover:bg-yellow-300 shadow-[1px_1px_0px_0px_#000]"
                    >
                      <Pin className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs font-bold text-neutral-700 line-clamp-1">
                  {post.caption || post.topText}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {unpinnedPosts.map((post) => (
            <div
              key={post.id}
              id={`profile-list-item-${post.id}`}
              className="flex flex-col sm:flex-row items-center gap-4 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="h-32 w-32 shrink-0 border-2 border-black bg-neutral-100 p-1 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <img
                  src={post.imageDataUrl}
                  alt="Meme"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-xs font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                    {post.triggerLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-600">{post.createdAt}</span>
                </div>
                <h4 className="text-sm font-black uppercase text-black">{post.caption}</h4>
                <div className="flex items-center gap-4 text-xs font-black text-black pt-2 border-t border-black">
                  <span className="flex items-center gap-1 text-red-600">
                    <Heart className="h-4 w-4 fill-current" />
                    {post.likes} likes
                  </span>
                  <span>{post.comments.length} comments</span>
                  <button
                    onClick={() => onPinPost(post.id)}
                    className="border-2 border-black bg-white hover:bg-yellow-200 px-2 py-1 shadow-[1px_1px_0px_0px_#000] ml-auto text-xs font-black uppercase flex items-center gap-1"
                  >
                    <Pin className="h-3 w-3" />
                    <span>Pin to top</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {userPosts.length === 0 && (
        <div className="border-4 border-black bg-white p-12 text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-black bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000]">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase text-black">You haven't spawned any memes yet</h4>
            <p className="text-xs font-bold text-neutral-600 mt-1 max-w-sm mx-auto">
              Interact with any trigger in the interface to spawn memes and post them to your profile.
            </p>
          </div>
          <button
            id="btn-profile-goto-triggers"
            onClick={onSwitchToTriggers}
            className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Zap className="h-4 w-4" />
            <span>Go to Triggers</span>
          </button>
        </div>
      )}
    </div>
  );
};
