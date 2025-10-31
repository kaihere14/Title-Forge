import "dotenv/config";

export const verifyNityasha = (req, res, next) => {
  if (!process.env.NITYASHA_API_KEY) {
    console.error("NITYASHA_API_KEY is not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.NITYASHA_API_KEY) {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden: Invalid or missing API key." });
  }
};