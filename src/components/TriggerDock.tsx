import React, { useState, useRef, useEffect } from "react";
import {
  Rocket,
  GitPullRequest,
  Laptop,
  Layers,
  Terminal,
  Calendar,
  Coffee,
  MessageSquare,
  Mail,
  Tv,
  ShoppingBag,
  Clock,
  MousePointerClick,
  Gauge,
  AlertOctagon,
  Sparkles,
  Flame,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { TriggerItem } from "../types";
import { APP_TRIGGERS } from "../data/triggers";
import { playSound } from "../utils/audio";

interface TriggerDockProps {
  onSelectTrigger: (trigger: TriggerItem, customNote?: string) => void;
  onOpenCustomModal: () => void;
}

// Icon mapper
const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  GitPullRequest,
  Laptop,
  Layers,
  Terminal,
  Calendar,
  Coffee,
  MessageSquare,
  Mail,
  Tv,
  ShoppingBag,
  Clock,
  MousePointerClick,
  Gauge,
  AlertOctagon,
};

export const TriggerDock: React.FC<TriggerDockProps> = ({
  onSelectTrigger,
  onOpenCustomModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive widget states
  // 1. Rage Click state
  const [rageClicks, setRageClicks] = useState(0);
  const rageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Panic Slider state
  const [panicLevel, setPanicLevel] = useState(25);

  // 3. Hold button state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quick custom prompt
  const [quickInput, setQuickInput] = useState("");

  // Rage click logic
  const handleRageClick = (trigger: TriggerItem) => {
    playSound("trigger");
    const nextCount = rageClicks + 1;
    setRageClicks(nextCount);

    if (rageTimerRef.current) clearTimeout(rageTimerRef.current);

    if (nextCount >= 5) {
      playSound("panik");
      setRageClicks(0);
      onSelectTrigger(trigger, "User repeatedly slammed button 5 times in sheer frustration!");
      return;
    }

    rageTimerRef.current = setTimeout(() => {
      setRageClicks(0);
    }, 1800);
  };

  // Hold button logic
  const startHold = (trigger: TriggerItem) => {
    playSound("trigger");
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 2400; // 2.4s hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        playSound("panik");
        onSelectTrigger(trigger, "Held down the prohibited big red button for over 2.5 seconds!");
      }
    }, 40);
  };

  const endHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  // Panic slider trigger
  const handlePanicChange = (trigger: TriggerItem, val: number) => {
    setPanicLevel(val);
    if (val >= 100) {
      playSound("panik");
      onSelectTrigger(trigger, `Panic meter pushed to critical 100% MAXIMUM OVERLOAD!`);
      setTimeout(() => setPanicLevel(35), 600);
    }
  };

  // Filter triggers
  const filteredTriggers = APP_TRIGGERS.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch =
      t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.context.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    playSound("trigger");
    const customTrigger: TriggerItem = {
      id: "custom-quick-" + Date.now(),
      label: quickInput.trim(),
      subtitle: "Custom user situation created just now",
      icon: "Sparkles",
      category: "life",
      badge: "Custom Trigger",
      context: quickInput.trim(),
      defaultTemplateId: "this-is-fine",
      colorScheme: {
        bg: "bg-amber-950/40",
        hoverBg: "hover:bg-amber-900/50",
        border: "border-amber-500/40",
        text: "text-amber-300",
        glow: "hover:shadow-amber-900/30",
      },
    };
    onSelectTrigger(customTrigger, quickInput.trim());
    setQuickInput("");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden border-4 border-black bg-yellow-400 p-6 sm:p-8 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Flame className="h-3.5 w-3.5 fill-current text-yellow-400" />
            <span>Interactive Meme Trigger Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
            Trigger a real situation.{" "}
            <span className="underline decoration-4 decoration-black">
              Spawn & Post the Meme.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-relaxed max-w-2xl">
            Click any trigger button below or interact with physical chaos widgets. Each
            action invokes the Gemini AI meme engine to craft tailored meme imagery, punchlines, and
            social captions that you can immediately post to the live feed or your profile.
          </p>

          {/* Quick Custom Situation Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                id="input-quick-situation"
                type="text"
                placeholder="Or type any specific situation (e.g. 'Prod database wiped by intern')..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="w-full border-2 border-black bg-white px-4 py-2.5 text-sm font-bold text-black placeholder:text-neutral-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50"
              />
            </div>
            <button
              id="btn-quick-generate"
              type="submit"
              className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-neutral-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Sparkles className="h-4 w-4" />
              <span>Trigger Meme</span>
            </button>
          </form>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Triggers" },
            { id: "chaos", label: "Chaos Widgets 💥" },
            { id: "dev", label: "Dev & Tech 💻" },
            { id: "office", label: "Corporate & Office ☕" },
            { id: "life", label: "Everyday Internet 🍕" },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => {
                playSound("switch");
                setSelectedCategory(cat.id);
              }}
              className={`border-2 border-black px-3.5 py-1.5 text-xs font-black uppercase tracking-tight transition-all ${
                selectedCategory === cat.id
                  ? "bg-black text-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
          <input
            id="input-search-triggers"
            type="text"
            placeholder="Search triggers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-black bg-white py-2 pl-9 pr-3 text-xs font-bold uppercase placeholder:text-neutral-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTriggers.map((trigger) => {
          const IconComp = ICON_MAP[trigger.icon] || Sparkles;

          // 1. Interactive Rage Click Widget
          if (trigger.interactiveType === "rage-click") {
            return (
              <div
                key={trigger.id}
                id={`trigger-card-${trigger.id}`}
                className="group relative flex flex-col justify-between border-2 border-black bg-fuchsia-50 p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-fuchsia-100"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="border-2 border-black bg-fuchsia-300 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                      {trigger.badge}
                    </span>
                    <span className="text-xs font-mono font-black uppercase text-fuchsia-950">
                      {rageClicks}/5 clicks
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-black uppercase tracking-tight text-black">{trigger.label}</h3>
                  <p className="mt-1 text-xs font-bold text-neutral-700">{trigger.subtitle}</p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full border-2 border-black bg-white overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-150"
                      style={{ width: `${(rageClicks / 5) * 100}%` }}
                    />
                  </div>
                  <button
                    id="btn-action-rage-click"
                    onClick={() => handleRageClick(trigger)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-black bg-fuchsia-400 hover:bg-fuchsia-300 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <MousePointerClick className="h-4 w-4" />
                    <span>{rageClicks === 0 ? "CLICK REPEATEDLY (5X)" : `CLICK FASTER! (${5 - rageClicks} LEFT)`}</span>
                  </button>
                </div>
              </div>
            );
          }

          // 2. Interactive Panic Slider Widget
          if (trigger.interactiveType === "panic-slider") {
            const isCritical = panicLevel > 80;
            return (
              <div
                key={trigger.id}
                id={`trigger-card-${trigger.id}`}
                className={`group relative flex flex-col justify-between border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  isCritical ? "bg-red-200" : "bg-red-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="border-2 border-black bg-red-400 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_#000]">
                      {trigger.badge}
                    </span>
                    <span className={`text-xs font-mono font-black uppercase ${isCritical ? "text-red-900 animate-pulse" : "text-neutral-800"}`}>
                      {panicLevel}% Panic
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-black uppercase tracking-tight text-black">{trigger.label}</h3>
                  <p className="mt-1 text-xs font-bold text-neutral-700">{trigger.subtitle}</p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-neutral-800 font-black">CALM</span>
                    <input
                      id="slider-panic-meter"
                      type="range"
                      min="10"
                      max="100"
                      value={panicLevel}
                      onChange={(e) => handlePanicChange(trigger, Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                    <span className="text-[10px] text-red-700 font-black">MELTDOWN</span>
                  </div>
                  <button
                    id="btn-action-panic-max"
                    onClick={() => handlePanicChange(trigger, 100)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-black bg-red-500 hover:bg-red-600 py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <Gauge className="h-3.5 w-3.5" />
                    <span>Trigger Max Panic (100%)</span>
                  </button>
                </div>
              </div>
            );
          }

          // 3. Interactive Hold Button Widget
          if (trigger.interactiveType === "hold-trigger") {
            return (
              <div
                key={trigger.id}
                id={`trigger-card-${trigger.id}`}
                className="group relative flex flex-col justify-between border-2 border-black bg-amber-50 p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-amber-100"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_0px_#000]">
                      {trigger.badge}
                    </span>
                    <span className="text-xs text-amber-950 font-mono font-black">
                      {Math.round(holdProgress)}%
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-black uppercase tracking-tight text-black">{trigger.label}</h3>
                  <p className="mt-1 text-xs font-bold text-neutral-700">{trigger.subtitle}</p>
                </div>

                <div className="mt-5">
                  <button
                    id="btn-action-hold-self-destruct"
                    onMouseDown={() => startHold(trigger)}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={() => startHold(trigger)}
                    onTouchEnd={endHold}
                    className="relative w-full overflow-hidden border-2 border-black bg-white py-3 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    {/* Fill bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-yellow-400 transition-all duration-75 text-black"
                      style={{ width: `${holdProgress}%` }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <AlertOctagon className="h-4 w-4" />
                      {isHolding ? "HOLDING TIGHT..." : "PRESS & HOLD 3 SECONDS"}
                    </span>
                  </button>
                </div>
              </div>
            );
          }

          // Standard Action Trigger Button
          return (
            <div
              key={trigger.id}
              id={`trigger-card-${trigger.id}`}
              className="group relative flex flex-col justify-between border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <IconComp className="h-4.5 w-4.5" />
                  </div>
                  <span className="border-2 border-black bg-neutral-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_0px_#000]">
                    {trigger.badge}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base font-black uppercase tracking-tight text-black line-clamp-2">
                  {trigger.label}
                </h3>
                <p className="mt-1 text-xs font-bold text-neutral-700 line-clamp-2 leading-relaxed">
                  {trigger.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-neutral-600">
                  Click to spawn
                </span>
                <button
                  id={`btn-trigger-${trigger.id}`}
                  onClick={() => {
                    playSound("trigger");
                    onSelectTrigger(trigger);
                  }}
                  className="flex items-center gap-1.5 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Trigger</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTriggers.length === 0 && (
        <div className="border-4 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-base font-black uppercase text-black">No triggers matching your query.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 border-2 border-black bg-yellow-400 hover:bg-yellow-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
