import React, { useState } from "react";
import { X, Sparkles, PlusCircle } from "lucide-react";
import { TriggerItem, MemeTemplateId } from "../types";
import { MEME_TEMPLATES } from "../data/templates";
import { playSound } from "../utils/audio";

interface CustomTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrigger: (trigger: TriggerItem) => void;
}

export const CustomTriggerModal: React.FC<CustomTriggerModalProps> = ({
  isOpen,
  onClose,
  onAddTrigger,
}) => {
  if (!isOpen) return null;

  const [label, setLabel] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"dev" | "office" | "life" | "chaos">("dev");
  const [templateId, setTemplateId] = useState<MemeTemplateId>("this-is-fine");
  const [badge, setBadge] = useState("Custom Trigger");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    playSound("trigger");
    const newTrigger: TriggerItem = {
      id: "custom-" + Date.now(),
      label: label.trim(),
      subtitle: subtitle.trim() || "Created by user in Custom Trigger Engine",
      icon: "Sparkles",
      category,
      badge: badge.trim() || "Custom",
      context: `${label.trim()} - ${subtitle.trim()}`,
      defaultTemplateId: templateId,
      colorScheme: {
        bg: "bg-white",
        hoverBg: "hover:bg-yellow-50",
        border: "border-black",
        text: "text-black",
        glow: "hover:shadow-[4px_4px_0px_0px_#000]",
      },
    };

    onAddTrigger(newTrigger);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div
        id="modal-custom-trigger"
        className="relative w-full max-w-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-400 hover:bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-black" />
            <h3 className="text-xl font-black uppercase tracking-tight text-black">Create Custom Trigger Button</h3>
          </div>
          <p className="text-xs font-bold text-neutral-600">
            Design a new interactive trigger button to add to your interface dock.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-black">Trigger Action Name</label>
            <input
              id="input-custom-label"
              type="text"
              required
              placeholder="e.g. WiFi Drops During CEO Presentation"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full border-2 border-black bg-white px-3.5 py-2 text-xs font-black text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black">Subtitle / Relatable Detail</label>
            <input
              id="input-custom-subtitle"
              type="text"
              placeholder="e.g. 400 people stare at frozen screen in awkward silence"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1 w-full border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase text-black">Category</label>
              <select
                id="select-custom-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              >
                <option value="dev">Dev & Tech 💻</option>
                <option value="office">Corporate & Office 👔</option>
                <option value="life">Everyday Internet 🍕</option>
                <option value="chaos">Interactive Chaos 💥</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-black">Default Meme Format</label>
              <select
                id="select-custom-template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value as any)}
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              >
                {Object.keys(MEME_TEMPLATES).map((tid) => (
                  <option key={tid} value={tid}>
                    {MEME_TEMPLATES[tid as MemeTemplateId].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black">Badge Label</label>
            <input
              id="input-custom-badge"
              type="text"
              placeholder="e.g. Pure Dread, 500 Error, Panic Mode"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1 w-full border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black placeholder:text-neutral-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-black bg-white hover:bg-neutral-100 px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Cancel
            </button>
            <button
              id="btn-submit-custom-trigger"
              type="submit"
              className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Add to Interface Dock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
