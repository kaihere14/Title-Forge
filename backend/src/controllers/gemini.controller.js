import { GoogleGenAI } from "@google/genai";
import Perplexity from "@perplexity-ai/perplexity_ai";

const ai = new GoogleGenAI({});
const client = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

export const generateTitlesFlow = async (titles) => {
  try {
    if (!Array.isArray(titles) || titles.length === 0) {
      throw new Error("Please provide an array of 5 titles");
    }

    const analysisPrompt = `
You are an advanced YouTube strategist and trend researcher.
For each of the following titles, perform **deep linguistic and engagement analysis**.

Identify the following attributes for each title:
1. tone/vibe (e.g., Motivational, Tutorial, Storytelling, Shocking, Relatable)
2. dominant emotion (e.g., Curiosity, Excitement, Humor, Inspiration, Fear, Nostalgia)
3. main keywords or topics (core 3–6 focus words)
4. hook style (e.g., Question, Suspense, Emotional, Tutorial, Fear of Missing Out)
5. content type (Educational, Entertainment, Opinion, Documentary, Challenge)
6. emotional intensity (scale 1–10)
7. power words or uncommon words present
8. target audience intent (Learn, Feel, Laugh, Discover, Buy)
9. missing elements that could improve CTR (e.g., curiosity gap, emotional trigger, specificity)

Titles:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return structured JSON like:
{
  "analysis": [
    {
      "title": "string",
      "tone": "string",
      "emotion": "string",
      "keywords": ["..."],
      "hook_style": "string",
      "content_type": "string",
      "intensity": number,
      "power_words": ["..."],
      "intent": "string",
      "missing_elements": ["..."]
    }
  ]
}`;

    const analysisResponse = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [{ role: "user", content: analysisPrompt }],
    });

    const raw = analysisResponse.choices[0]?.message?.content || "{}";
    let analysis = [];

    try {
      const parsed = JSON.parse(raw);
      analysis = parsed.analysis || [];
    } catch (err) {
      console.error("⚠️ Failed to parse Perplexity JSON:", err);
      analysis = titles.map((t) => ({
        title: t,
        tone: "neutral",
        emotion: "curiosity",
        keywords: [],
        hook_style: "general",
        content_type: "educational",
        intensity: 5,
        power_words: [],
        intent: "discover",
        missing_elements: [],
      }));
    }

    const formattedAnalysis = analysis
      .map(
        (a, i) => `
${i + 1}. Title: "${a.title}"
Tone: ${a.tone}
Emotion: ${a.emotion}
Keywords: ${a.keywords.join(", ")}
Hook Style: ${a.hook_style}
Content Type: ${a.content_type}
Power Words: ${a.power_words.join(", ")}
Intent: ${a.intent}
Intensity: ${a.intensity}/10
Missing Elements: ${a.missing_elements.join(", ")}
`
      )
      .join("\n\n");

    const geminiPrompt = `
You are a **world-class YouTube title optimizer** who understands human psychology and algorithmic CTR.

Your job: Rewrite or enhance each of the following 5 analyzed titles into **viral, SEO-optimized YouTube titles** that sound natural and emotionally powerful.

──────────────────────────────
TITLE ANALYSIS INPUT:
──────────────────────────────
${formattedAnalysis}

──────────────────────────────
RULES:
──────────────────────────────
1. Keep the **meaning and core topic** intact, but make the phrasing more engaging.
2. Each title must:
   - Be **50–68 characters long**
   - Have a natural reading rhythm (not robotic)
   - Include **at least one power word** (from: secret, insane, real, hidden, shocking, unbelievable, pro, ultimate, magic, genius, asli, mind-blowing, next-level, game-changing)
   - Include **1–2 uncommon but simple words** to sound unique (from: hidden, raw, unfiltered, smart, twisted, surprising, rare)
   - Include **1–2 emotional words** (from: shocking, crazy, inspiring, beautiful, sad, fun, real)
   - Mix 20–30% common words (like “the”, “this”, “you”, “my”)
3. If input contains Hindi or Hinglish, output fully in Hinglish (English letters only, no Hindi script).
4. Avoid clickbait — it must sound believable and human.
5. Output **exactly 5 titles only**, one per line.
6. End every title with an "@" symbol.
7. No explanations or extra text — only final titles.

──────────────────────────────
EXAMPLES:
──────────────────────────────
Input: "AI Tools for Students"
Output: "Top 5 Hidden AI Tools Every Student Must Try in 2025 @"

Input: "How to Grow on YouTube Fast"
Output: "Real Tricks to Grow on YouTube Faster Than Ever @"

──────────────────────────────
GENERATE NOW:
──────────────────────────────
`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiPrompt,
      generationConfig: {
        temperature: 0.95, // creative but coherent
        topK: 40,
        topP: 0.85,
      },
    });

    const text = (geminiResponse?.text ?? "")
      .toString()
      .replaceAll("&amp;", "&")
      .trim();

    const improvedTitles = text
      .split("@")
      .map((p) => p.trim())
      .filter(Boolean);

    return improvedTitles;
  } catch (err) {
    console.error("Flow Error:", err);
    throw new Error("Failed to process titles");
  }
};
