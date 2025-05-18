import { getChannelId } from "../apiScripts/channelIdGetter.js";
import { getPlaylistId } from "../apiScripts/playlistIdGetter.js";
import { getVideoIds } from "../apiScripts/videoIdGetter.js";
import { getVideoInfo } from "../apiScripts/videoInfoGetter.js";
import { createVideoCsv } from "./csvMaker.js";
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY;
if (!apiKey)
    throw new Error("Missing API_KEY in environment variables");
async function getVideos(handle, uploadTypes) {
    const channelId = await getChannelId(apiKey, handle);
    const playlistIds = await getPlaylistId(channelId, uploadTypes);
    const videoIds = await getVideoIds(apiKey, playlistIds);
    const videos = await getVideoInfo(apiKey, videoIds);
    console.log(videos);
    if (Boolean(Object.keys(videos).length)) {
        const sortedEntries = Object.entries(videos).sort(([, a], [, b]) => b.NumericDate - a.NumericDate);
        const sortedVideos = Object.fromEntries(sortedEntries);
        createVideoCsv(sortedVideos, handle);
    }
    else {
        if (uploadTypes.length == 3) {
            console.log("######## No Videos #########");
            console.log(`No uploads of any type found for channel ${handle}`);
        }
        else {
            console.log("######## No Videos of Type #########");
            console.log(`No ${uploadTypes.join(', ')} found for channel ${handle}`);
        }
    }
}
export default getVideos;
