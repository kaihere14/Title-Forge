import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function titleEnhance(title) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `give better title (keep language english) for the follwing data in the given format and at the end of every title add a @ response only the follwing data : ${title}`,
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
