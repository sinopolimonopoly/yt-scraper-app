import { getChannelId } from '../apiScripts/channelIdGetter.js';
import { getChannelIdInfo } from '../apiScripts/channelInfoGetter.js';
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API_KEY;
if (!apiKey)
    throw new Error("Missing API_KEY in environment variables");
async function getChannelInfo(handle) {
    console.log("we made it in da function");
    const channelId = await getChannelId(apiKey, handle);
    if (channelId == "") {
        console.log("Get Info Main function exited.");
        console.log(`No channel found with handle: ${handle}.`);
        process.exit(0);
    }
    const channelInfo = await getChannelIdInfo(channelId, apiKey);
    return channelInfo;
}
export default getChannelInfo;
