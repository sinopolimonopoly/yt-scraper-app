import { get } from 'http';
import { getChannelId } from '../apiScripts/channelIdGetter.js';
import { getChannelIdInfo } from '../apiScripts/channelInfoGetter.js';

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY!;
if (!apiKey) throw new Error("Missing API_KEY in environment variables");

async function getChannelInfo(handle: string) {

    const channelId = await getChannelId(apiKey, handle);

    if (channelId == "") {
        console.log("Get Info Main function exited.")
        console.log(`No channel found with handle: ${handle}.`)

        return {
            result: {},
            error: true,
            errorMessage: `No channel found with handle ${handle}`
        }
    }

    const channelInfo = await getChannelIdInfo(apiKey, channelId)

    return {
        result: channelInfo,
        error: false,
        errorMessage: ""
    }

}

export default getChannelInfo;