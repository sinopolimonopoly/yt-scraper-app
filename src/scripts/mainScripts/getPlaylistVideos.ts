import { getPlaylistVideoIds } from "../apiScripts/playlistSearch/playlistVideoIdGetter";
import { getPlaylistVideosInfo } from "../apiScripts/playlistSearch/playlistVideoInfoGetter";

import { PlaylistVideoResults } from "../apiScripts/playlistSearch/playlistVideoInfoGetter";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY!;
if (!apiKey) throw new Error("Missing API_KEY in environment variables");

async function getPlaylistVideos(playlistId: string): Promise<PlaylistVideoResults> {
    const playlistVidIds = await getPlaylistVideoIds(apiKey, playlistId);

    if (playlistVidIds.error == true) {
        return {
            results: null,
            error: true,
            errorMessage: playlistVidIds.errorMessage
        }
    }

    const playlistVideos = await getPlaylistVideosInfo(apiKey, playlistVidIds.videoIds ?? []);

    if (playlistVideos.error == true) {
        return {
            results: null,
            error: true,
            errorMessage: playlistVideos.errorMessage
        }
    }

    else {
        return playlistVideos
    }
}