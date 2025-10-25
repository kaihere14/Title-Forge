import axios from "axios";
import "dotenv/config";
import { titleEnhance } from "./gemini.controller.js";
import User from "../models/user.model.js";
import { sendTitles } from "./resend.controller.js";

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
    const channelId = response.data.items[0].id.channelId;
    const { answer, value } = await latestVideos(channelId);
    await sendTitles(value, answer, email);
    const userId = req.userId;
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: -1, usedCredits: +1 },
    });
    return res
      .status(200)
      .json({
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

export const latestVideos = async (channelId) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`
    );
    const videoData = response.data.items;
    const value = [];
    videoData.map((val, index) => {
      value.push(val.snippet.title);
    });
    const answer = await titleEnhance(value);
    return { answer, value };
  } catch (error) {
    console.error("Error fetching latest videos:", error.message);
    throw new Error("Failed to fetch latest videos");
  }
};
