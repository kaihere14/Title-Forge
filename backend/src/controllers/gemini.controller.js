import { GoogleGenAI } from "@google/genai";
import Perplexity from "@perplexity-ai/perplexity_ai";

const ai = new GoogleGenAI({});
const client = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

const uncommonWords = [
  "Boost", "Glow", "Flip", "Snap", "Burst", "Drift", "Lift", "Pop", "Rush", "Spark",
  "Hidden", "Rare", "Sneak", "Twist", "Fresh", "Real", "Secret", "Behind",
  "Calm", "Bright", "Neat", "Clean", "Cozy", "Chill", "Pure", "Smooth", "Crisp", "Easy",
  "Sync", "Swap", "Flow", "Track", "Drop", "Patch", "Tune", "Scan"
];

// --- Helper to clean Markdown symbols like * or ** ---
const sanitizeTitle = (text) => {
  return text
    .replace(/\*{1,2}(.*?)\*{1,2}/g, "$1") // remove * or ** emphasis
    .replace(/`/g, "")                    // remove backticks
    .replace(/#+/g, "")                   // remove headers
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // remove markdown links
    .trim();
};

export const generateTitlesFlow = async (titles) => {
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
    const cleaned = raw.replace(/^```json|```/g, "").trim();
    const analysis = JSON.parse(cleaned);

    // --- Phase 2: Gemini Rewrite (same as before) ---
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
      generationConfig: { temperature: 0.9, topK: 30, topP: 0.85 },
    });

    const text = geminiResponse?.text?.trim() || "";

    // --- Clean up Markdown or * characters ---
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
