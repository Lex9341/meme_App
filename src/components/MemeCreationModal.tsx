import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  UserCheck,
  Download,
  RefreshCw,
  Sliders,
  Check,
  Flame,
  Layers,
  ChevronDown,
} from "lucide-react";
import { MemeTemplateId, TriggerItem, SocialPost } from "../types";
import { MEME_TEMPLATES } from "../data/templates";
import { renderMemeToDataUrl } from "../utils/canvasMeme";
import { playSound } from "../utils/audio";

interface MemeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: TriggerItem | null;
  customContext?: string;
  onPostToFeed: (post: Omit<SocialPost, "id" | "createdAt" | "likes" | "hasLiked" | "reactionCounts" | "reposts" | "comments">) => void;
  onPostToProfile: (post: Omit<SocialPost, "id" | "createdAt" | "likes" | "hasLiked" | "reactionCounts" | "reposts" | "comments">) => void;
}

export const MemeCreationModal: React.FC<MemeCreationModalProps> = ({
  isOpen,
  onClose,
  trigger,
  customContext,
  onPostToFeed,
  onPostToProfile,
}) => {
  if (!isOpen || !trigger) return null;

  // State for meme generation and customization
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplateId>(
    trigger.defaultTemplateId || "this-is-fine"
  );
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [styleLevel, setStyleLevel] = useState<"relatable" | "savage" | "corporate" | "chaotic">("relatable");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [renderedImageUrl, setRenderedImageUrl] = useState("");
  const [postedSuccessMessage, setPostedSuccessMessage] = useState<string | null>(null);

  // Initialize or generate on trigger change
  useEffect(() => {
    const initMeme = async () => {
      setSelectedTemplate(trigger.defaultTemplateId || "this-is-fine");
      setIsGeneratingAI(true);
      setPostedSuccessMessage(null);

      try {
        const response = await fetch("/api/memes/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            triggerId: trigger.id,
            triggerLabel: trigger.label,
            context: customContext || trigger.context,
            style: styleLevel,
            selectedTemplateId: trigger.defaultTemplateId,
          }),
        });

        if (response.ok) {
          const res = await response.json();
          if (res.data) {
            setTopText(res.data.topText || "WHEN DISASTER STRIKES");
            setBottomText(res.data.bottomText || "I CANNOT BELIEVE THIS");
            setCaption(res.data.caption || "Felt this directly in my soul.");
            setTags(res.data.tags || ["#Meme", "#Relatable"]);
            if (res.data.templateId && MEME_TEMPLATES[res.data.templateId as MemeTemplateId]) {
              setSelectedTemplate(res.data.templateId as MemeTemplateId);
            }
            playSound("meme-spawn");
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch meme generation from backend, using fallback:", err);
      } finally {
        setIsGeneratingAI(false);
      }

      // Fallback
      const templateMeta = MEME_TEMPLATES[trigger.defaultTemplateId || "this-is-fine"];
      setTopText(templateMeta.defaultTop);
      setBottomText(templateMeta.defaultBottom);
      setCaption(`When you trigger: "${trigger.label}"`);
      setTags(["#Relatable", "#MemeTrigger", "#InternetLife"]);
      playSound("meme-spawn");
      setIsGeneratingAI(false);
    };

    initMeme();
  }, [trigger, customContext]);

  // Re-render canvas whenever text or template changes
  useEffect(() => {
    if (!topText && !bottomText) return;

    try {
      const dataUrl = renderMemeToDataUrl({
        templateId: selectedTemplate,
        topText: topText || "TOP TEXT",
        bottomText: bottomText || "BOTTOM TEXT",
        triggerLabel: trigger.label,
        caption,
      });
      setRenderedImageUrl(dataUrl);
    } catch (err) {
      console.error("Canvas render error:", err);
    }
  }, [selectedTemplate, topText, bottomText, caption, trigger.label]);

  // Trigger Gemini AI Re-roll
  const handleRegenerateAI = async () => {
    setIsGeneratingAI(true);
    playSound("switch");
    try {
      const response = await fetch("/api/memes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerId: trigger.id,
          triggerLabel: trigger.label,
          context: customContext || trigger.context,
          style: styleLevel,
          selectedTemplateId: selectedTemplate,
        }),
      });
      const res = await response.json();
      if (res.data) {
        setTopText(res.data.topText);
        setBottomText(res.data.bottomText);
        setCaption(res.data.caption);
        setTags(res.data.tags || []);
        playSound("meme-spawn");
      }
    } catch (err) {
      console.error("Error regenerating AI meme:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Direct Post to Feed
  const handlePostFeed = () => {
    playSound("post-feed");
    onPostToFeed({
      memeId: "meme-" + Date.now(),
      triggerId: trigger.id,
      triggerLabel: trigger.label,
      templateId: selectedTemplate,
      topText,
      bottomText,
      caption,
      tags,
      imageDataUrl: renderedImageUrl,
      authorName: "Alex Mercer",
      authorHandle: "@alex_triggered",
      authorAvatar: "⚡",
      authorBadge: "Trigger Master",
      postedToFeed: true,
      postedToProfile: false,
      isCurrentUser: true,
    });
    setPostedSuccessMessage("Successfully posted directly to the Live Social Feed! 🚀");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Direct Post to Profile
  const handlePostProfile = () => {
    playSound("post-feed");
    onPostToProfile({
      memeId: "meme-" + Date.now(),
      triggerId: trigger.id,
      triggerLabel: trigger.label,
      templateId: selectedTemplate,
      topText,
      bottomText,
      caption,
      tags,
      imageDataUrl: renderedImageUrl,
      authorName: "Alex Mercer",
      authorHandle: "@alex_triggered",
      authorAvatar: "⚡",
      authorBadge: "Trigger Master",
      postedToFeed: false,
      postedToProfile: true,
      isCurrentUser: true,
    });
    setPostedSuccessMessage("Successfully saved and posted directly to your User Profile! 👤");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Download PNG file
  const handleDownload = () => {
    if (!renderedImageUrl) return;
    playSound("switch");
    const link = document.createElement("a");
    link.download = `meme-${trigger.id}-${Date.now()}.png`;
    link.href = renderedImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-meme-creation"
        className="relative flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Close Button */}
        <button
          id="btn-close-meme-modal"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow-400 hover:bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LEFT COLUMN: Visual Meme Preview */}
        <div className="flex-1 flex flex-col items-center justify-center bg-yellow-100 p-6 border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-y-auto">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 bg-red-600 animate-pulse border border-black" />
              <span className="text-xs font-black text-black uppercase tracking-wider">
                Meme Spawned Live
              </span>
            </div>
            <span className="text-xs text-neutral-800 font-mono font-bold">
              800 × 800 PNG Canvas
            </span>
          </div>

          {/* Rendered Canvas Image */}
          <div className="relative w-full max-w-md aspect-square border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white flex items-center justify-center p-2 group">
            {renderedImageUrl ? (
              <img
                id="img-meme-preview"
                src={renderedImageUrl}
                alt="Generated Meme"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-neutral-800 font-black">
                <RefreshCw className="h-7 w-7 animate-spin text-black" />
                <span className="text-xs uppercase">Rendering meme canvas...</span>
              </div>
            )}

            {isGeneratingAI && (
              <div className="absolute inset-0 bg-yellow-400/90 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <Sparkles className="h-8 w-8 text-black animate-spin" />
                <span className="text-sm font-black uppercase text-black">
                  Gemini AI crafting punchline...
                </span>
              </div>
            )}
          </div>

          {/* Quick Caption Preview */}
          <div className="w-full max-w-md mt-4 p-3 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold text-black italic line-clamp-2">
              "{caption}"
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t, idx) => (
                <span key={idx} className="border border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Controls, Customization & Direct Posting */}
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto max-h-[85vh] lg:max-h-none space-y-5 bg-white">
          <div>
            {/* Header / Trigger context */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 border-2 border-black bg-yellow-400 px-2.5 py-0.5 text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                <span>Trigger:</span>
                <span>{trigger.label}</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Customize & Post Meme</h2>
              <p className="text-xs font-bold text-neutral-600">
                Fine-tune captions, switch meme format, or re-roll punchlines with Gemini AI.
              </p>
            </div>

            {/* Success toast inside modal */}
            {postedSuccessMessage && (
              <div className="mt-3 p-3 border-2 border-black bg-green-300 text-black text-xs font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                <Check className="h-4 w-4 shrink-0" />
                <span>{postedSuccessMessage}</span>
              </div>
            )}

            {/* Template Selector Carousel */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-black uppercase text-black flex items-center justify-between">
                <span>Meme Template</span>
                <span className="text-[11px] font-mono font-bold text-neutral-700">
                  {MEME_TEMPLATES[selectedTemplate]?.name}
                </span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(MEME_TEMPLATES) as MemeTemplateId[]).map((tid) => {
                  const tm = MEME_TEMPLATES[tid];
                  const isSelected = selectedTemplate === tid;
                  return (
                    <button
                      key={tid}
                      id={`btn-select-template-${tid}`}
                      onClick={() => {
                        playSound("switch");
                        setSelectedTemplate(tid);
                      }}
                      className={`flex flex-col items-center justify-center p-2 border-2 border-black text-center transition-all ${
                        isSelected
                          ? "bg-yellow-400 text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <span className="text-lg">{tm.accentIcon}</span>
                      <span className="mt-1 text-[10px] font-black uppercase truncate w-full">
                        {tm.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Style Vibe & Re-roll */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-black">
                  AI Humor Tone
                </label>
                <button
                  id="btn-reroll-gemini"
                  onClick={handleRegenerateAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 border border-black bg-yellow-400 hover:bg-yellow-300 px-2 py-0.5 text-xs font-black uppercase text-black shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  <RefreshCw className={`h-3 w-3 ${isGeneratingAI ? "animate-spin" : ""}`} />
                  <span>Re-roll Gemini</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {(["relatable", "savage", "corporate", "chaotic"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    id={`btn-tone-${lvl}`}
                    onClick={() => {
                      setStyleLevel(lvl);
                      playSound("switch");
                    }}
                    className={`flex-1 border-2 border-black py-1.5 text-xs font-black uppercase transition-all ${
                      styleLevel === lvl
                        ? "bg-black text-yellow-400 shadow-[2px_2px_0px_0px_#000]"
                        : "bg-white text-black hover:bg-yellow-100 shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="mt-4 space-y-2.5">
              <div>
                <label className="text-[11px] font-black uppercase text-black">
                  Top Caption (UPPERCASE)
                </label>
                <input
                  id="input-top-text"
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value.toUpperCase())}
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="TOP MEME TEXT..."
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-black">
                  Bottom Punchline (UPPERCASE)
                </label>
                <input
                  id="input-bottom-text"
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="BOTTOM MEME PUNCHLINE..."
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-black">
                  Social Post Caption
                </label>
                <textarea
                  id="textarea-post-caption"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none resize-none"
                  placeholder="What's happening in this situation..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Direct Post to Feed / Profile / Download */}
          <div className="pt-3 border-t-2 border-black space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Post to Live Social Feed */}
              <button
                id="btn-post-to-feed"
                onClick={handlePostFeed}
                className="flex items-center justify-center gap-2 border-2 border-black bg-yellow-400 hover:bg-yellow-300 py-2.5 px-4 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Send className="h-4 w-4" />
                <span>Post Directly to Feed</span>
              </button>

              {/* Post to User Profile */}
              <button
                id="btn-post-to-profile"
                onClick={handlePostProfile}
                className="flex items-center justify-center gap-2 border-2 border-black bg-black hover:bg-neutral-800 py-2.5 px-4 text-xs font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <UserCheck className="h-4 w-4 text-yellow-400" />
                <span>Post to Profile</span>
              </button>
            </div>

            {/* Download Button */}
            <button
              id="btn-download-meme-png"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 border-2 border-black bg-white hover:bg-neutral-100 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Meme Image (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
