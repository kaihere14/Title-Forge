import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function titleEnhance(title) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an elite YouTube content strategist, SEO copywriter, and CTR optimization expert trained to produce titles that score 90+ on MonsterInsights and CoSchedule Headline Analyzer.

Your job: Generate **exactly 5 viral, SEO-optimized, high-CTR YouTube titles** for the following video idea: "${title}".

──────────────────────────────
🔤 LANGUAGE RULES
──────────────────────────────
1. If the input is in **Hindi or Hinglish**, rewrite it entirely in **Hinglish (English letters only)** — no Hindi script.
   - Preserve the emotional tone and natural phrasing of Hindi.
   - Example: "तेरा नाम क्या है" → "Tera Naam Kya Hai"
2. If the input is in **English**, write purely in English — natural, creator-style, not robotic.

──────────────────────────────
🧠 SEO + CTR PRINCIPLES
──────────────────────────────
- Each title should be **under 65 characters**.
- All 5 titles should be of **roughly equal length** (±5 characters difference) for visual and algorithmic consistency.
- Integrate relevant **YouTube keywords** and **search intent phrases** naturally.
- Use rhythm, tone variation, and emotional pull — avoid fake clickbait.
- Trigger curiosity using **open loops**, contrast, and relatable emotions.

──────────────────────────────
💥 WORD BALANCE GOALS (MANDATORY)
──────────────────────────────
Every title must aim for:
- 20–30% **Common Words** (a, the, is, my, this, you)
- 10–20% **Uncommon Words** (unique but readable)
- 10–15% **Emotional Words** (crazy, shocking, beautiful, heart-touching)
- At least one **Power Word** (ultimate, hidden, real, secret, best, insane, shocking, unbelievable, pro, asli)

──────────────────────────────
🎨 STYLE + TONE
──────────────────────────────
- Sound like a **top Indian or international creator** with an engaging tone.
- Blend curiosity, storytelling, and emotion.
- Avoid all caps or spammy punctuation — use clean, human-readable style.
- Titles should feel **authentic yet scroll-stopping**.

──────────────────────────────
📦 OUTPUT FORMAT
──────────────────────────────
- Output **exactly 5 titles only** — no more.
- Each title should end with an "@" symbol.
- Do not include any explanations, comments, or numbering.
- Example Output:
  Tera Naam Kya Hai? Full Story Explained @
  The Hidden Truth About Mumbai Nights @

──────────────────────────────
DATA TO IMPROVE:
──────────────────────────────
${title}
`

  });

  const text = (response?.text ?? "").toString();
  // Normalize common HTML entity for ampersand and trim
  const normalized = text.replaceAll("&amp;", "&").trim();

  // If the model uses '@' as separator, split and return cleaned entries
  if (normalized.includes("@")) {
    const parts = normalized
      .split("@")
      .map((p) => p.trim())
      .filter(Boolean);
    return parts;
  }

  // Fallback: return the raw text as a single-element array
  return [normalized];
}

export { titleEnhance };
