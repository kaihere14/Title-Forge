import axios from "axios";
import "dotenv/config";
import {
  directGeminiGenerate,
  generateTitlesFlow,
} from "./gemini.controller";
import User from "../models/user.model";
import { Request, Response } from "express";
import { sendTitles } from "./resend.controller";
import { redis } from "../db/redis.db";
import FavLog, { IFavLog } from "../models/favLog";

export interface GetYoutubeIdType {
  name : string;
  email : string
}

export interface LatestVideosType {
  uploadsPlaylistId : string;
  channelId : string;
  favLogs : IFavLog[];
}


export interface videoData {
  title: string;
  videoId: string;
}

export const getYoutubeId = async (req:Request, res:Response):Promise<unknown> => {
  const { name, email } = req.body as GetYoutubeIdType;
  const userId = String(req.userId);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const favLogs = await FavLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
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
    const { answer, value } = await latestVideos({ uploadsPlaylistId, channelId , favLogs } as LatestVideosType);
    await sendTitles({oldTitles: value, newTitles: answer, email});
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
    console.error("Error fetching YouTube channel ID:", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width?: number; height?: number };
      medium?: { url: string; width?: number; height?: number };
      high?: { url: string; width?: number; height?: number };
      standard?: { url: string; width?: number; height?: number };
      maxres?: { url: string; width?: number; height?: number };
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
}




export const latestVideos = async ({ uploadsPlaylistId, channelId, favLogs }: LatestVideosType) => {

  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=5&key=${apiKey}`
    );
    const videoData = response.data.items as YouTubePlaylistItem[];

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

    return { answer, value };
  } catch (error) {
    console.error("Error fetching latest videos:", (error as Error).message);
    throw new Error("Failed to fetch latest videos");
  }
};
