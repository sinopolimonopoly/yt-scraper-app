import { retrievePlaylistInfo } from "../apiScripts/playlistSearch/playlistInfoGetter.js";
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY;
if (!apiKey)
    throw new Error("Missing API_KEY in environment variables");
async function getPlaylistInfo(playlistId) {
    const playlistInfo = await retrievePlaylistInfo(apiKey, playlistId);
    if (playlistInfo.error == true) {
        return {
            results: null,
            error: true,
            errorMessage: playlistInfo.errorMessage
        };
    }
    else {
        return playlistInfo;
    }
}
export default getPlaylistInfo;
