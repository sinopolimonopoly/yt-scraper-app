import { getPlaylistInfo } from "../apiScripts/playlistSearch/playlistInfoGetter.js";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY!;
if (!apiKey) throw new Error("Missing API_KEY in environment variables");

async function getPlaylistVideos(playlistId: string) {
    const 
}