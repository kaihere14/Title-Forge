import { redis } from "../db/redis.db.js";

const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // This is the value we'll discuss

export const rateLimit2 = async (req, res, next) => {
  const ip = req.userId // Use userId if available, otherwise fallback to IP address
  const key = `rateLimit:${ip}`; // Use a distinct key prefix for this specific rate limiter

  try {
    const requestsInWindow = await redis.incr(key);

    if (requestsInWindow === 1) {
      // If it's the first request in the window, set the expiry
      await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }

    if (requestsInWindow > MAX_REQUESTS_PER_WINDOW) {
      return res
        .status(429) // Correct status code for Too Many Requests
        .json({ message: `Rate limit exceeded. Please try again in ${RATE_LIMIT_WINDOW_SECONDS} seconds.` });
    }

    next();

  } catch (error) {
    console.error("Redis rate limit error:", error);
    // Even if Redis fails, we should probably still allow the request to proceed
    // to avoid blocking legitimate users. Log the error and move on.
    next(); 
  }
};