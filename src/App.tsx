import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { TriggerDock } from "./components/TriggerDock";
import { SocialFeed } from "./components/SocialFeed";
import { ProfilePage } from "./components/ProfilePage";
import { MemeCreationModal } from "./components/MemeCreationModal";
import { CustomTriggerModal } from "./components/CustomTriggerModal";
import { TriggerItem, SocialPost, UserProfile } from "./types";
import { APP_TRIGGERS } from "./data/triggers";
import { renderMemeToDataUrl } from "./utils/canvasMeme";
import { playSound } from "./utils/audio";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"triggers" | "feed" | "profile">("triggers");
  const [isMuted, setIsMuted] = useState(false);

  // Modals state
  const [activeTrigger, setActiveTrigger] = useState<TriggerItem | null>(null);
  const [customContext, setCustomContext] = useState<string>("");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Mercer",
    handle: "@alex_triggered",
    avatarEmoji: "⚡",
    bio: "Senior Chaos Engineer & Weekend Pager Surfer. Transforming everyday software and life panic into viral memes since 2026.",
    location: "Localhost:3000",
    joinedDate: "January 2026",
    totalMemesTriggered: 14,
    viralKarma: 3420,
    unlockedBadges: [
      {
        id: "badge-friday",
        name: "Friday Deployer",
        icon: "🚀",
        description: "Pushed straight to production right before the weekend.",
        dateUnlocked: "Today",
      },
      {
        id: "badge-rage",
        name: "Rage Clicker",
        icon: "🖱️",
        description: "Clicked frozen UI 5 times in under 2 seconds.",
        dateUnlocked: "Yesterday",
      },
      {
        id: "badge-panic",
        name: "Panic Whisperer",
        icon: "🔥",
        description: "Maxed out the panic meter without crashing LinkedIn.",
        dateUnlocked: "2 days ago",
      },
      {
        id: "badge-inbox",
        name: "Inbox Zero Hero",
        icon: "📬",
        description: "Marked 3,000 unread emails as read in 1 click.",
        dateUnlocked: "Last week",
      },
    ],
  });

  // Social Feed Posts (seeded with real rendered canvas memes)
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Seed initial memes on first mount with canvas rendering
  useEffect(() => {
    try {
      const seed1Url = renderMemeToDataUrl({
        templateId: "this-is-fine",
        topText: "DEPLOYING TO PROD AT 4:59 PM ON FRIDAY",
        bottomText: "ME: THIS IS COMPLETELY FINE",
        triggerLabel: "Deploy to Prod on Friday at 5:00 PM",
      });

      const seed2Url = renderMemeToDataUrl({
        templateId: "drake",
        topText: "WRITING EXTENSIVE UNIT TESTS",
        bottomText: "GIT PUSH --FORCE ORIGIN MAIN",
        triggerLabel: "git push --force origin main",
      });

      const seed3Url = renderMemeToDataUrl({
        templateId: "two-buttons",
        topText: "SPEND 3 DAYS REFACTORING",
        bottomText: "ADD // TODO: FIX LATER (1 SEC)",
        triggerLabel: "The Rage Click Trigger",
      });

      const seedPosts: SocialPost[] = [
        {
          id: "post-seed-1",
          memeId: "meme-seed-1",
          triggerId: "deploy-friday",
          triggerLabel: "Deploy to Prod on Friday at 5:00 PM",
          templateId: "this-is-fine",
          topText: "DEPLOYING TO PROD AT 4:59 PM ON FRIDAY",
          bottomText: "ME: THIS IS COMPLETELY FINE",
          caption: "I too enjoy living life on the absolute edge of a weekend pager alert meltdown.",
          tags: ["#DevOps", "#FridayDeploy", "#ThisIsFine", "#OnCallLife"],
          imageDataUrl: seed1Url,
          authorName: "Alex Mercer",
          authorHandle: "@alex_triggered",
          authorAvatar: "⚡",
          authorBadge: "Trigger Master",
          createdAt: "15m ago",
          likes: 142,
          hasLiked: false,
          userReaction: "💀",
          reactionCounts: { "😂": 38, "💀": 84, "🔥": 21, "🚀": 12, "🤦‍♂️": 45 },
          reposts: 28,
          comments: [
            {
              id: "c1",
              userName: "Marcus (DevOps)",
              userHandle: "@marcus_k8s",
              avatarEmoji: "🛠️",
              commentText: "Bro I am literally on call this weekend why do you hate me 😭",
              timeAgo: "12m ago",
              likes: 19,
            },
            {
              id: "c2",
              userName: "Sarah PM",
              userHandle: "@agile_sarah",
              avatarEmoji: "📋",
              commentText: "Was this ticket approved in sprint planning? Asking for a friend 💀",
              timeAgo: "8m ago",
              likes: 12,
            },
          ],
          postedToFeed: true,
          postedToProfile: true,
          isCurrentUser: true,
        },
        {
          id: "post-seed-2",
          memeId: "meme-seed-2",
          triggerId: "git-push-force",
          triggerLabel: "git push --force origin main",
          templateId: "drake",
          topText: "WRITING EXTENSIVE UNIT TESTS",
          bottomText: "GIT PUSH --FORCE ORIGIN MAIN",
          caption: "If it builds locally for 4 seconds, that is basically verified production grade.",
          tags: ["#GitPushForce", "#SeniorDevWrath", "#CowboyCoding"],
          imageDataUrl: seed2Url,
          authorName: "Devin Codes",
          authorHandle: "@devin_commit",
          authorAvatar: "💻",
          authorBadge: "Merge Destroyer",
          createdAt: "42m ago",
          likes: 218,
          hasLiked: true,
          userReaction: "😂",
          reactionCounts: { "😂": 112, "💀": 67, "🔥": 44, "🚀": 35, "🤦‍♂️": 18 },
          reposts: 54,
          comments: [
            {
              id: "c3",
              userName: "Elena",
              userHandle: "@elena_sec",
              avatarEmoji: "🛡️",
              commentText: "Security audit team has entered the chat 👀",
              timeAgo: "30m ago",
              likes: 25,
            },
          ],
          postedToFeed: true,
          postedToProfile: false,
          isCurrentUser: false,
        },
        {
          id: "post-seed-3",
          memeId: "meme-seed-3",
          triggerId: "rage-click",
          triggerLabel: "The Rage Click Trigger",
          templateId: "two-buttons",
          topText: "SPEND 3 DAYS REFACTORING",
          bottomText: "ADD // TODO: FIX LATER (1 SEC)",
          caption: "Nothing is more permanent than a temporary software workaround.",
          tags: ["#TechDebt", "#Relatable", "#CodeHumor"],
          imageDataUrl: seed3Url,
          authorName: "Jordan Lead",
          authorHandle: "@jordan_arch",
          authorAvatar: "☕",
          authorBadge: "Code Whisperer",
          createdAt: "2h ago",
          likes: 389,
          hasLiked: false,
          reactionCounts: { "😂": 140, "💀": 98, "🔥": 62, "🚀": 40, "🤦‍♂️": 89 },
          reposts: 72,
          comments: [],
          postedToFeed: true,
          postedToProfile: false,
          isCurrentUser: false,
        },
      ];

      setPosts(seedPosts);
      // Pin seed 1 to profile
      setProfile((prev) => ({ ...prev, pinnedMemeId: "post-seed-1" }));
    } catch (e) {
      console.error("Failed to seed memes:", e);
    }
  }, []);

  // Handler: User triggers an action
  const handleSelectTrigger = (trigger: TriggerItem, customNote?: string) => {
    setActiveTrigger(trigger);
    setCustomContext(customNote || "");
  };

  // Handler: Post directly to Live Social Feed
  const handlePostToFeed = (
    newPostData: Omit<
      SocialPost,
      "id" | "createdAt" | "likes" | "hasLiked" | "reactionCounts" | "reposts" | "comments"
    >
  ) => {
    const newPost: SocialPost = {
      ...newPostData,
      id: "post-" + Date.now(),
      createdAt: "Just now",
      likes: 1,
      hasLiked: true,
      userReaction: "🔥",
      reactionCounts: { "🔥": 1 },
      reposts: 0,
      comments: [],
      postedToFeed: true,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Update profile stats
    setProfile((prev) => ({
      ...prev,
      totalMemesTriggered: prev.totalMemesTriggered + 1,
      viralKarma: prev.viralKarma + 50,
    }));
  };

  // Handler: Post directly to User Profile
  const handlePostToProfile = (
    newPostData: Omit<
      SocialPost,
      "id" | "createdAt" | "likes" | "hasLiked" | "reactionCounts" | "reposts" | "comments"
    >
  ) => {
    const newPost: SocialPost = {
      ...newPostData,
      id: "post-" + Date.now(),
      createdAt: "Just now",
      likes: 1,
      hasLiked: true,
      userReaction: "🔥",
      reactionCounts: { "🔥": 1 },
      reposts: 0,
      comments: [],
      postedToProfile: true,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Update profile stats & pin if not set
    setProfile((prev) => ({
      ...prev,
      totalMemesTriggered: prev.totalMemesTriggered + 1,
      viralKarma: prev.viralKarma + 35,
      pinnedMemeId: prev.pinnedMemeId || newPost.id,
    }));
  };

  // Handler: Add custom trigger to dock
  const handleAddCustomTrigger = (newTrigger: TriggerItem) => {
    APP_TRIGGERS.unshift(newTrigger);
    handleSelectTrigger(newTrigger);
  };

  // Handler: Like a post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willLike = !p.hasLiked;
        return {
          ...p,
          hasLiked: willLike,
          likes: willLike ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  // Handler: React with emoji
  const handleReactPost = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentReaction = p.userReaction;
        const newCounts = { ...p.reactionCounts };

        if (currentReaction === emoji) {
          // Deselect
          newCounts[emoji] = Math.max(0, (newCounts[emoji] || 1) - 1);
          return { ...p, userReaction: undefined, reactionCounts: newCounts };
        } else {
          // Switch or add
          if (currentReaction && newCounts[currentReaction]) {
            newCounts[currentReaction] = Math.max(0, newCounts[currentReaction] - 1);
          }
          newCounts[emoji] = (newCounts[emoji] || 0) + 1;
          return { ...p, userReaction: emoji, reactionCounts: newCounts };
        }
      })
    );
  };

  // Handler: Add a comment
  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: "comment-" + Date.now(),
      userName: profile.name,
      userHandle: profile.handle,
      avatarEmoji: profile.avatarEmoji,
      commentText,
      timeAgo: "Just now",
      likes: 0,
      isUser: true,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      })
    );
  };

  // Handler: AI Follower Comments
  const handleGenerateAIComments = async (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    try {
      const response = await fetch("/api/memes/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerLabel: targetPost.triggerLabel,
          topText: targetPost.topText,
          bottomText: targetPost.bottomText,
          caption: targetPost.caption,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.comments && Array.isArray(data.comments)) {
          const generated = data.comments.map((c: any, idx: number) => ({
            id: `ai-comment-${Date.now()}-${idx}`,
            userName: c.userName || "Dev Follower",
            userHandle: c.userHandle || "@follower",
            avatarEmoji: c.avatarEmoji || "🤖",
            commentText: c.commentText || "Solid meme 💀",
            timeAgo: c.timeAgo || "Just now",
            likes: Math.floor(Math.random() * 8) + 1,
          }));

          setPosts((prev) =>
            prev.map((p) => {
              if (p.id !== postId) return p;
              return {
                ...p,
                comments: [...p.comments, ...generated],
              };
            })
          );
          playSound("like");
        }
      }
    } catch (err) {
      console.warn("AI comments failed, using fallback:", err);
    }
  };

  // Handler: Pin / Unpin Post on Profile
  const handlePinPost = (postId: string) => {
    playSound("switch");
    setProfile((prev) => ({
      ...prev,
      pinnedMemeId: prev.pinnedMemeId === postId ? undefined : postId,
    }));
  };

  // Handler: Delete post
  const handleDeletePost = (postId: string) => {
    playSound("switch");
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Filter user posts for profile
  const userPosts = useMemo(() => {
    return posts.filter((p) => p.isCurrentUser || p.postedToProfile);
  }, [posts]);

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          playSound("switch");
          setCurrentTab(tab);
        }}
        feedBadgeCount={posts.length}
        userMemesCount={userPosts.length}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === "triggers" && (
          <TriggerDock
            onSelectTrigger={handleSelectTrigger}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        )}

        {currentTab === "feed" && (
          <SocialFeed
            posts={posts}
            onLikePost={handleLikePost}
            onReactPost={handleReactPost}
            onAddComment={handleAddComment}
            onGenerateAIComments={handleGenerateAIComments}
            onSwitchToTriggers={() => setCurrentTab("triggers")}
          />
        )}

        {currentTab === "profile" && (
          <ProfilePage
            profile={profile}
            userPosts={userPosts}
            onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
            onPinPost={handlePinPost}
            onDeletePost={handleDeletePost}
            onSwitchToTriggers={() => setCurrentTab("triggers")}
          />
        )}
      </main>

      {/* System Telemetry Neo-Brutalist Footer */}
      <footer className="mt-auto border-t-4 border-black px-6 py-3 bg-black text-white flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 bg-emerald-400 inline-block animate-ping" />
            System Status: 100% Dank
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline text-neutral-300">Active Triggers: 15 Loaded</span>
        </div>
        <span className="font-bold text-neutral-200">©2025 MEMESTREAM NEURAL LINK • BOLD TYPOGRAPHY</span>
        <div className="flex items-center gap-4">
          <span className="text-neutral-300">MEME ENGINE: ACTIVE</span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="text-yellow-400 font-bold">API Latency: 12ms</span>
        </div>
      </footer>

      {/* Meme Creation / Posting Modal */}
      <MemeCreationModal
        isOpen={!!activeTrigger}
        onClose={() => setActiveTrigger(null)}
        trigger={activeTrigger}
        customContext={customContext}
        onPostToFeed={handlePostToFeed}
        onPostToProfile={handlePostToProfile}
      />

      {/* Custom Trigger Builder Modal */}
      <CustomTriggerModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddTrigger={handleAddCustomTrigger}
      />
    </div>
  );
}
