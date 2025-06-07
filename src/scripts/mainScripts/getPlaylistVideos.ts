import { getPlaylistVideoIds } from "../apiScripts/playlistSearch/playlistVideoIdGetter.js";
import { getPlaylistVideosInfo } from "../apiScripts/playlistSearch/playlistVideoInfoGetter.js";

import { PlaylistVideoResults } from "../apiScripts/playlistSearch/playlistVideoInfoGetter.js";
import { createVideoCsv } from "./csvMaker.js";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY!;
if (!apiKey) throw new Error("Missing API_KEY in environment variables");

async function getPlaylistVideos(playlistId: string, channel: string): Promise<PlaylistVideoResults> {
    const playlistVidIds = await getPlaylistVideoIds(apiKey, playlistId);

    if (playlistVidIds.error == true) {
        return {
            result: null,
            error: true,
            errorMessage: playlistVidIds.errorMessage
        }
    }

    const playlistVideos = await getPlaylistVideosInfo(apiKey, playlistVidIds.videoIds ?? []);

    if (playlistVideos.error == true) {
        return {
            result: null,
            error: true,
            errorMessage: playlistVideos.errorMessage
        }
    }

    else if (playlistVideos.result) {
        createVideoCsv(playlistVideos.result, channel.split(" ").join("_"), false);
        return playlistVideos
    }

    else {
        return {
            result: null,
            error: true,
            errorMessage: "No idea how we got here I'll be real"
        }
    }
}

export default getPlaylistVideos