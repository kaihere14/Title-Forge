import "dotenv/config";
import { redis } from "../db/redis.db";
import axios from "axios";
import Log from "../models/logs.model";
import { directGeminiGenerate, generateTitlesFlow } from "./gemini.controller";
import { Request,Response } from "express";
import { LatestVideosType, YouTubePlaylistItem } from "./yt.controller";

export const nityashaGetYoutubeId = async (req:Request, res:Response) => {
  const { name } = req.body as { name: string };
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const channelName = name.toString().trim();
  const encodedChannelName = encodeURIComponent(channelName)
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodedChannelName}&key=${apiKey}`
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
    const { answer, value } = await nityashaLatestVideos({ uploadsPlaylistId, channelId  } as LatestVideosType);

    Log.create({
      name: channelName,
      oldTitles: JSON.stringify(value),
      newTitles: JSON.stringify(answer),
    });

    return res.status(200).json({
      oldTitles: value,
      newTitles: answer,
      channelName: channelName,
      channelId: channelId,
    });
  } catch (error) {
    console.error("Error fetching YouTube channel ID:", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const nityashaLatestVideos =async ({ uploadsPlaylistId, channelId, favLogs }: LatestVideosType) => {
  console.log("Fetching latest videos for playlist ID:", uploadsPlaylistId);
  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=5&key=${apiKey}`
    );
    const videoData = response.data.items as YouTubePlaylistItem[];
    console.log("Fetched video data:", videoData);
    const value:string[]= [];
    videoData.map((val, index) => {
      value.push(val.snippet.title);
    });
    let answer:string[];
    const cachedAnalysis = await redis.get(`channel_analysis:${channelId}`);
    if (cachedAnalysis) {
      console.log("Using cached analysis for channel:", channelId);
      answer = await directGeminiGenerate(JSON.parse(cachedAnalysis),favLogs);
    } else {
      answer = await generateTitlesFlow(value, channelId  , favLogs);
    }
    console.log("Generated new titles:", answer);
    return { answer, value };
  } catch (error) {
    console.error("Error fetching latest videos:", (error as Error).message);
    throw new Error("Failed to fetch latest videos");
  }
};