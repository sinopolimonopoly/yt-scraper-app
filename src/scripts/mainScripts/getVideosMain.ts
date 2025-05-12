import { getChannelId } from "../apiScripts/channelIdGetter";
import { getPlaylistId } from "../apiScripts/playlistIdGetter";
import { getVideoIds } from "../apiScripts/videoIdGetter";
import { getVideoInfo } from "../apiScripts/videoInfoGetter";
import { createVideoCsv } from "./csvMaker";

async function main() {
    const handle = "maxthemeatguy"
    const uploadType = "shorts"

    const channelId = await getChannelId(handle)

    const playlistIds = await getPlaylistId(channelId, uploadType);

    const videoIds = await getVideoIds(playlistIds);

    const videos = await getVideoInfo(videoIds);

    if (Boolean(Object.keys(videos).length)) {
        const sortedEntries = Object.entries(videos).sort(([, a], [, b]) => b.NumericDate - a.NumericDate)

        const sortedVideos = Object.fromEntries(sortedEntries)
        createVideoCsv(sortedVideos, handle, uploadType);
    }

    else {
        if(["videos", "shorts", "livestreams"].includes(uploadType)) {
            console.log("XXXXXXXX No Output XXXXXXXXXX")
            console.log(`No ${uploadType} found for handle @${handle}`)
         }
        
         else {
            console.log("######## No Videos #########")
         }
    }
    
}


main()