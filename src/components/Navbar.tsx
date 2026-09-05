import React from "react";
import { Zap, Radio, User, Volume2, VolumeX, PlusCircle } from "lucide-react";
import { toggleAudioMute } from "../utils/audio";

interface NavbarProps {
  currentTab: "triggers" | "feed" | "profile";
  onTabChange: (tab: "triggers" | "feed" | "profile") => void;
  feedBadgeCount?: number;
  userMemesCount?: number;
  onOpenCustomModal: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  feedBadgeCount = 0,
  userMemesCount = 0,
  onOpenCustomModal,
  isMuted,
  setIsMuted,
}) => {
  const handleToggleSound = () => {
    const updated = toggleAudioMute();
    setIsMuted(updated);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-yellow-400 text-black shadow-[0_4px_0_0_#000]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-button"
            onClick={() => onTabChange("triggers")}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-black text-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black">
                  Meme<span className="underline decoration-4 decoration-black">Trigger</span>
                </span>
                <span className="border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                  PROD v2
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-800 hidden md:block">
                Trigger Physical UI Events → Spawn Dank Memes
              </p>
            </div>
          </button>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="flex items-center gap-2">
          <button
            id="nav-tab-triggers"
            onClick={() => onTabChange("triggers")}
            className={`flex items-center gap-1.5 border-2 border-black px-3.5 py-1.5 text-xs sm:text-sm font-black uppercase tracking-tight transition-all ${
              currentTab === "triggers"
                ? "bg-black text-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-yellow-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Triggers</span>
          </button>

          <button
            id="nav-tab-feed"
            onClick={() => onTabChange("feed")}
            className={`relative flex items-center gap-1.5 border-2 border-black px-3.5 py-1.5 text-xs sm:text-sm font-black uppercase tracking-tight transition-all ${
              currentTab === "feed"
                ? "bg-black text-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-yellow-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Feed</span>
            {feedBadgeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center border border-black bg-red-500 px-1 text-[10px] font-black text-white">
                {feedBadgeCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => onTabChange("profile")}
            className={`flex items-center gap-1.5 border-2 border-black px-3.5 py-1.5 text-xs sm:text-sm font-black uppercase tracking-tight transition-all ${
              currentTab === "profile"
                ? "bg-black text-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-yellow-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
            {userMemesCount > 0 && (
              <span className="border border-black bg-yellow-400 px-1 text-[10px] font-black text-black">
                {userMemesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Custom Trigger Builder Button */}
          <button
            id="btn-custom-trigger"
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 border-2 border-black bg-white hover:bg-yellow-200 px-3 py-1.5 text-xs font-black uppercase tracking-tight text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <PlusCircle className="h-4 w-4 text-black" />
            <span className="hidden lg:inline">+ Custom Trigger</span>
          </button>

          {/* Audio toggle */}
          <button
            id="btn-toggle-audio"
            onClick={handleToggleSound}
            title={isMuted ? "Unmute UI sound effects" : "Mute UI sound effects"}
            className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white hover:bg-yellow-200 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-neutral-400" /> : <Volume2 className="h-4 w-4 text-black" />}
          </button>
        </div>
      </div>
    </header>
  );
};
