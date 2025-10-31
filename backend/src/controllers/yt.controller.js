import axios from "axios";
import "dotenv/config";
import {
  directGeminiGenerate,
  generateTitlesFlow,
} from "./gemini.controller.js";
import User from "../models/user.model.js";
import { sendTitles } from "./resend.controller.js";
import { redis } from "../db/redis.db.js";

export const getYoutubeId = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const channelName = name.toString().trim();
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${apiKey}`
    );
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: "Channel not found" });
    }
    const channelId = response.data.items[0].id.channelId;
    const response2 = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!response2.data.items || response2.data.items.length === 0) {
      return res.status(404).json({ error: "Channel details not found" });
    }
    const uploadsPlaylistId =
      response2.data.items[0].contentDetails.relatedPlaylists.uploads;
    const { answer, value } = await latestVideos(uploadsPlaylistId, channelId);
    await sendTitles(value, answer, email);
    const userId = req.userId;
    await redis.del(`user_info:${userId}`);
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: -1, usedCredits: +1 },
    });

    return res.status(200).json({
      oldTitles: value,
      newTitles: answer,
      channelName: channelName,
      channelId: channelId,
    });
  } catch (error) {
    console.error("Error fetching YouTube channel ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const latestVideos = async (uploadsPlaylistId, channelId) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=5&key=${apiKey}`
    );
    const videoData = response.data.items;
    const value = [];
    videoData.map((val, index) => {
      value.push(val.snippet.title);
    });
    let answer;
    const cachedAnalysis = await redis.get(`channel_analysis:${channelId}`);
    if (cachedAnalysis) {
      console.log("Using cached analysis for channel:", channelId);
      answer = await directGeminiGenerate(JSON.parse(cachedAnalysis));
    } else {
      answer = await generateTitlesFlow(value, channelId);
    }
    return { answer, value };
  } catch (error) {
    console.error("Error fetching latest videos:", error.message);
    throw new Error("Failed to fetch latest videos");
  }
};
