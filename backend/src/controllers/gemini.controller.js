import { GoogleGenAI } from "@google/genai";
import Perplexity from "@perplexity-ai/perplexity_ai";
import { redis } from "../db/redis.db.js";

const ai = new GoogleGenAI({});
const client = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

const uncommonWords = [
  "Boost",
  "Glow",
  "Flip",
  "Snap",
  "Burst",
  "Drift",
  "Lift",
  "Pop",
  "Rush",
  "Spark",
  "Hidden",
  "Rare",
  "Sneak",
  "Twist",
  "Fresh",
  "Real",
  "Secret",
  "Behind",
  "Calm",
  "Bright",
  "Neat",
  "Clean",
  "Cozy",
  "Chill",
  "Pure",
  "Smooth",
  "Crisp",
  "Easy",
  "Sync",
  "Swap",
  "Flow",
  "Track",
  "Drop",
  "Patch",
  "Tune",
  "Scan",
];

const sanitizeTitle = (text) => {
  return text
    .replace(/\*{1,2}(.*?)\*{1,2}/g, "$1")
    .replace(/`/g, "")
    .replace(/#+/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
};

export const generateTitlesFlow = async (titles, channelId) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error("Please provide an array of titles");
  }

  try {
    // --- Phase 1: Perplexity Analysis ---
    const analysisPrompt = `
For each title, return brief analysis JSON only. 
Keys: title, tone, emotion, keywords, hook, intensity(1–10), missing.

Titles:
${titles.map((t) => `- ${t}`).join("\n")}

Output JSON only:
[
  {"title":"", "tone":"", "emotion":"", "keywords":[], "hook":"", "intensity":0, "missing":[]}
]
`;

    const analysisResponse = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [{ role: "user", content: analysisPrompt }],
    });

    const raw = analysisResponse.choices?.[0]?.message?.content?.trim() || "[]";

    // More robust cleaning for markdown code blocks
    let cleaned = raw;

    // Remove ```json at the start
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*\n?/i, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*\n?/, "");
    }

    // Remove ``` at the end
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/\n?```\s*$/, "");
    }

    cleaned = cleaned.trim();

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse Perplexity response:", parseError);
      console.error("Raw response:", raw);
      console.error("Cleaned response:", cleaned);
      throw new Error("Failed to parse analysis response");
    }

    // Cache the analysis with proper Redis syntax (string, not object)
    try {
      await redis.set(
        `channel_analysis:${channelId}`,
        JSON.stringify(analysis),
        "EX",
        3600 // 1 hour expiry
      );
    } catch (redisError) {
      console.error("Redis cache error (non-critical):", redisError.message);
      // Continue even if caching fails
    }

    const geminiPrompt = `
Rewrite each of these titles for maximum YouTube CTR.
Rules:
- Keep core meaning.
- Do NOT use "*" or any markdown formatting.
- Use 1 uncommon word from this list: ${uncommonWords.join(", ")}.
- Add "new" or "down" naturally.
- 50–68 chars, human tone.
- Return one title per line.

${analysis.map((a) => `Title: ${a.title}`).join("\n")}
`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiPrompt,
      generationConfig: { temperature: 0.85, topK: 40, topP: 0.9 }
    });

    const text = geminiResponse?.text?.trim() || "";

    const sanitized = sanitizeTitle(text);
    const finalTitles = sanitized
      .split("\n")
      .map((t) => sanitizeTitle(t))
      .filter(Boolean);

    return finalTitles;
  } catch (err) {
    console.error("Error:", err);
    throw new Error("Title generation failed");
  }
};

export const directGeminiGenerate = async (analysis) => {
  console.log("Generating titles for channel:");

  const geminiPrompt = `
Rewrite each of these titles for maximum YouTube CTR.
Rules:
- Keep core meaning.
- Do NOT use "*" or any markdown formatting.
- Use 1 uncommon word from this list: ${uncommonWords.join(", ")}.
- Add "new" or "down" naturally.
- 50–68 chars, human tone.
- Return one title per line.

${analysis.map((a) => `Title: ${a.title}`).join("\n")}
`;

  try {
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiPrompt,
      generationConfig: { temperature: 0.85, topK: 40, topP: 0.9 }

    });

    const text = geminiResponse?.text?.trim() || "";

    const sanitized = sanitizeTitle(text);
    const finalTitles = sanitized
      .split("\n")
      .map((t) => sanitizeTitle(t))
      .filter(Boolean);

    return finalTitles;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Title generation failed");
  }
};
