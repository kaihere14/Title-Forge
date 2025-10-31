import "dotenv/config";
import { redis } from "../db/redis.db.js";
import axios from "axios";
import { directGeminiGenerate, generateTitlesFlow } from "./gemini.controller.js";

export const nityashaGetYoutubeId = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const channelName = name.toString().trim();
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${apiKey}`
    );
    const channelId = response.data.items[0].id.channelId;
    const response2 = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const uploadsPlaylistId =
      response2.data.items[0].contentDetails.relatedPlaylists.uploads;
    const { answer, value } = await nityashaLatestVideos(uploadsPlaylistId, channelId);

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

export const nityashaLatestVideos = async (uploadsPlaylistId, channelId) => {
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