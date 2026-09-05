import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Fallback curated meme punchlines dictionary by category and trigger
const CURATED_FALLBACKS: Record<string, Array<{ topText: string; bottomText: string; caption: string; tags: string[]; templateId: string }>> = {
  "deploy-friday": [
    {
      topText: "DEPLOYING TO PROD AT 4:59 PM ON FRIDAY",
      bottomText: "WHAT'S THE WORST THAT COULD POSSIBLY HAPPEN?",
      caption: "I too enjoy living life on the absolute edge of a pager alert meltdown.",
      tags: ["#DevOps", "#FridayDeploy", "#ThisIsFine", "#OnCallNightmare"],
      templateId: "this-is-fine",
    },
    {
      topText: "CI/CD PIPELINE: 24 FAILED CHECKS",
      bottomText: "ME CLICKING 'MERGE WITHOUT WAITING'",
      caption: "Rules were meant to be broken, especially production database integrity.",
      tags: ["#CowboyCoding", "#GitPushForce", "#ProdCrash"],
      templateId: "two-buttons",
    }
  ],
  "git-push-force": [
    {
      topText: "MERGE CONFLICT IN 87 FILES",
      bottomText: "GIT PUSH --FORCE --NO-VERIFY",
      caption: "If it's not on main, did their hard work even exist?",
      tags: ["#GitChaos", "#ForcePush", "#SeniorDevWrath"],
      templateId: "drake",
    }
  ],
  "meeting-email": [
    {
      topText: "A 90-MINUTE MANDATORY ALL-HANDS",
      bottomText: "COULD HAVE BEEN A 1-SENTENCE SLACK MESSAGE",
      caption: "Another hour of nodding along while drafting my resignation letter in my mind.",
      tags: ["#CorporateLife", "#MeetingFatigue", "#OfficeHumor"],
      templateId: "drake",
    },
    {
      topText: "JOINING ZOOM MEETING ON MUTE",
      bottomText: "CAMERA OFF, SOUL DETACHED, MIC MUTED FOREVER",
      caption: "Present in body, astral projecting to Hawaii in spirit.",
      tags: ["#RemoteWork", "#ZoomSurvival", "#CorporateZen"],
      templateId: "this-is-fine",
    }
  ],
  "it-works-on-my-machine": [
    {
      topText: "CLIENT: THE ENTIRE CHECKOUT SYSTEM IS CRASHING",
      bottomText: "ME: WORKS FINE ON MY MACBOOK PRO",
      caption: "Then ship your machine to the cloud, problem solved.",
      tags: ["#WorksOnMyMachine", "#DevLogic", "#DockerSavesLives"],
      templateId: "distracted-boyfriend",
    }
  ],
  "coffee-empty": [
    {
      topText: "ARRIVES AT BREAK ROOM FOR COFFEE",
      bottomText: "POT IS COMPLETELY EMPTY WITH 3 DROPS BURNED ON BOTTOM",
      caption: "Whoever left this crime scene unattended is getting no code reviews today.",
      tags: ["#CoffeeEmergency", "#OfficePolitics", "#Rage"],
      templateId: "panik-kalm",
    }
  ],
  "chrome-tabs": [
    {
      topText: "MY RAM WEEPING SOFTLY",
      bottomText: "ME OPENING 38 MORE STACKOVERFLOW TABS FOR ONE SYNTAX ERROR",
      caption: "64GB RAM was not a recommendation, it was a cry for mercy.",
      tags: ["#ChromeHungry", "#RAMEater", "#TechStruggles"],
      templateId: "expanding-brain",
    }
  ],
  "rage-click": [
    {
      topText: "BUTTON DOESN'T RESPOND IN 0.05 SECONDS",
      bottomText: "CLICKS 74 TIMES IN 3 SECONDS LIKE THAT SPEEDS UP THE SERVER",
      caption: "Human psychology at its absolute peak performance.",
      tags: ["#RageClick", "#Impatience", "#UIUXDisaster"],
      templateId: "two-buttons",
    }
  ],
  "panic-slider": [
    {
      topText: "LOGS SHOWING 500 INTERNAL SERVER ERROR IN PROD",
      bottomText: "CEO WALKING TOWARDS MY DESK WITH A SMILE",
      caption: "It is at this exact moment that updating my LinkedIn became top priority.",
      tags: ["#Defcon1", "#ProductionFire", "#CareerChangeNow"],
      templateId: "this-is-fine",
    }
  ],
  "default": [
    {
      topText: "WHEN THE UNTHINKABLE FINALLY HAPPENS",
      bottomText: "AND YOU ACT SURPRISED EVEN THOUGH YOU CAUSED IT",
      caption: "Never let the consequences of your own actions get in the way of a good meme.",
      tags: ["#Relatable", "#Mood", "#DailyGrind"],
      templateId: "this-is-fine",
    }
  ]
};

// API: Generate Meme with Gemini 3.8-flash (or smart fallback)
app.post("/api/memes/generate", async (req, res) => {
  try {
    const {
      triggerId,
      triggerLabel = "Custom Action",
      context = "Everyday life and digital chaos",
      style = "relatable", // 'savage' | 'relatable' | 'corporate' | 'chaotic' | 'tech'
      customPrompt = "",
      selectedTemplateId = "",
    } = req.body;

    const ai = getGenAI();

    if (ai) {
      const prompt = `You are a viral internet meme generator master and social media meme creator.
A user interacted with an interface trigger button titled: "${triggerLabel}"
Context/situation: "${context}".
Meme style vibe: "${style}".
User additional notes: "${customPrompt || "None"}".
Selected template preference: "${selectedTemplateId || "any popular meme template"}".

Generate a hilarious, ultra-viral meme response for this exact trigger moment.
Choose one templateId from:
- "this-is-fine" (classic dog in fire, disaster acceptance)
- "distracted-boyfriend" (temptation vs duty/current thing)
- "drake" (top rejection vs bottom approval)
- "two-buttons" (sweating guy choosing between two equally chaotic buttons)
- "expanding-brain" (small brain, galaxy brain, god tier)
- "panik-kalm" (panik, kalm, sudden realization panik)
- "buff-doge" (strong past vs crying weak present)
- "modern-card" (clean witty quote/tweet style viral meme card)

Provide:
1. templateId: one of the valid templateIds above
2. topText: UPPERCASE classic meme top text (short, punchy, 3-10 words)
3. bottomText: UPPERCASE classic meme bottom text (the punchline, 3-12 words)
4. caption: witty social post caption explaining the meme with humor and sarcasm
5. tags: array of 3-5 trending witty hashtags starting with #
6. characterReaction: emoji (e.g. 💀, 😭, 🚀, 🤦‍♂️, 🤡, 🔥)
7. alternateOptions: array of 2 alternative punchline objects with { topText, bottomText }`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                templateId: { type: Type.STRING },
                topText: { type: Type.STRING },
                bottomText: { type: Type.STRING },
                caption: { type: Type.STRING },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                characterReaction: { type: Type.STRING },
                alternateOptions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      topText: { type: Type.STRING },
                      bottomText: { type: Type.STRING },
                    },
                    required: ["topText", "bottomText"],
                  },
                },
              },
              required: ["templateId", "topText", "bottomText", "caption", "tags"],
            },
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text.trim());
          return res.json({
            success: true,
            source: "ai",
            data: {
              templateId: selectedTemplateId || parsed.templateId || "this-is-fine",
              topText: parsed.topText || "WHEN THE TRIGGER IS PRESSED",
              bottomText: parsed.bottomText || "ABSOLUTE INTERNET CHAOS ENSUES",
              caption: parsed.caption || "Felt this in my soul.",
              tags: parsed.tags || ["#Meme", "#Relatable"],
              characterReaction: parsed.characterReaction || "💀",
              alternateOptions: parsed.alternateOptions || [],
            },
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini generation failed, falling back to curated memes:", geminiErr);
      }
    }

    // Curated Fallback
    const triggerFallbacks = CURATED_FALLBACKS[triggerId] || CURATED_FALLBACKS["default"];
    const randomPick = triggerFallbacks[Math.floor(Math.random() * triggerFallbacks.length)];

    return res.json({
      success: true,
      source: "curated",
      data: {
        templateId: selectedTemplateId || randomPick.templateId,
        topText: randomPick.topText,
        bottomText: randomPick.bottomText,
        caption: randomPick.caption,
        tags: randomPick.tags,
        characterReaction: "💀",
        alternateOptions: [
          { topText: "ME TRYING TO FIX IT", bottomText: "MAKING IT 100X WORSE" },
          { topText: "EXPECTATION: SMOOTH SAILING", bottomText: "REALITY: PURE CATASTROPHE" },
        ],
      },
    });
  } catch (error: any) {
    console.error("Error in /api/memes/generate:", error);
    res.status(500).json({ error: error.message || "Failed to generate meme" });
  }
});

// API: Generate social comments on a meme
app.post("/api/memes/comment", async (req, res) => {
  try {
    const { topText, bottomText, caption, triggerLabel } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Given this meme:
Trigger: "${triggerLabel}"
Top text: "${topText}"
Bottom text: "${bottomText}"
Caption: "${caption}"

Generate 3 funny, realistic social media comments from different persona followers:
1. Dev/Colleague persona (e.g. sarcastic, deadpan, relatable)
2. Gen-Z/Internet meme enthusiast (slang, emojis like 💀, fr, no cap)
3. Wholesome/Confused bystander

Return JSON format:
{
  "comments": [
    { "userName": "...", "userHandle": "...", "avatarEmoji": "...", "commentText": "...", "timeAgo": "2m ago" }
  ]
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                comments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      userName: { type: Type.STRING },
                      userHandle: { type: Type.STRING },
                      avatarEmoji: { type: Type.STRING },
                      commentText: { type: Type.STRING },
                      timeAgo: { type: Type.STRING },
                    },
                    required: ["userName", "userHandle", "avatarEmoji", "commentText"],
                  },
                },
              },
              required: ["comments"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, comments: parsed.comments });
        }
      } catch (err) {
        console.warn("AI comments generation error:", err);
      }
    }

    // Default witty comments
    const defaultComments = [
      {
        userName: "Alex Dev",
        userHandle: "@alex_commits",
        avatarEmoji: "💻",
        commentText: "Bro woke up and chose violence in production 💀",
        timeAgo: "1m ago",
      },
      {
        userName: "Sarah PM",
        userHandle: "@agile_sarah",
        avatarEmoji: "📋",
        commentText: "Let's take this offline and circle back in the retro 😭",
        timeAgo: "3m ago",
      },
      {
        userName: "Meme Connoisseur",
        userHandle: "@viral_vibes",
        avatarEmoji: "🔥",
        commentText: "Never seen something describe my entire career so accurately.",
        timeAgo: "5m ago",
      },
    ];

    res.json({ success: true, comments: defaultComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate comments" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiEnabled: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Vite Middleware for development or static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Meme Trigger server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
