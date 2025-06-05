import { getPlaylistInfo } from "../apiScripts/playlistSearch/playlistInfoGetter.js";
import { PlaylistInfoInterface } from "../apiScripts/playlistSearch/playlistInfoGetter.js";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY!;
if (!apiKey) throw new Error("Missing API_KEY in environment variables");

async function fetchPlaylistInfo(playlistId: string): Promise<PlaylistInfoInterface> {
    const playlistInfo = await getPlaylistInfo(apiKey, playlistId);

    if (playlistInfo.error == true) {
        return {
            results: null,
            error: true,
            errorMessage: playlistInfo.errorMessage
        }
    }

    else {
        return playlistInfo
    }



}