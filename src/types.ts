export type MemeTemplateId =
  | "this-is-fine"
  | "distracted-boyfriend"
  | "drake"
  | "two-buttons"
  | "expanding-brain"
  | "panik-kalm"
  | "buff-doge"
  | "modern-card";

export interface MemeTemplate {
  id: MemeTemplateId;
  name: string;
  category: "classic" | "modern" | "reaction";
  aspectRatio: string;
  description: string;
  defaultTop: string;
  defaultBottom: string;
  primaryColor: string;
  bgGradient: string;
  accentIcon: string;
}

export interface TriggerItem {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  category: "dev" | "office" | "life" | "chaos";
  badge: string;
  context: string;
  defaultTemplateId: MemeTemplateId;
  interactiveType?: "button" | "rage-click" | "hold-trigger" | "panic-slider";
  colorScheme: {
    bg: string;
    hoverBg: string;
    border: string;
    text: string;
    glow: string;
  };
}

export interface CommentItem {
  id: string;
  userName: string;
  userHandle: string;
  avatarEmoji: string;
  commentText: string;
  timeAgo: string;
  likes: number;
  isUser?: boolean;
}

export interface SocialPost {
  id: string;
  memeId: string;
  triggerId: string;
  triggerLabel: string;
  templateId: MemeTemplateId;
  topText: string;
  bottomText: string;
  caption: string;
  tags: string[];
  imageDataUrl?: string; // Generated rendered image
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge: string;
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  userReaction?: string; // '😂' | '💀' | '🔥' | '🚀' | '🤦‍♂️'
  reactionCounts: Record<string, number>;
  reposts: number;
  comments: CommentItem[];
  postedToProfile: boolean;
  postedToFeed: boolean;
  isCurrentUser: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarEmoji: string;
  bio: string;
  location: string;
  joinedDate: string;
  totalMemesTriggered: number;
  viralKarma: number;
  pinnedMemeId?: string;
  unlockedBadges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    dateUnlocked: string;
  }>;
}
