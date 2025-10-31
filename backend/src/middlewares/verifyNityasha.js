import "dotenv/config";

export const verifyNityasha = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.NITYASHA_API_KEY) {
    next();
    } else {
    res.status(403).json({ error: "Forbidden: Invalid or missing API key." });
  }
};