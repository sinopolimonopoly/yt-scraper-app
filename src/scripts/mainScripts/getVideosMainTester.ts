import { getChannelId } from "../apiScripts/channelIdGetter";
import { getPlaylistId } from "../apiScripts/playlistIdGetter";
import { getVideoIds } from "../apiScripts/videoIdGetter";
import { getVideoInfo } from "../apiScripts/videoInfoGetter";
import { createVideoCsv } from "./csvMaker";

import { UploadType } from "../apiScripts/playlistIdGetter";

async function main() {
    const handle = "IShowSpeed"
    const uploadTypes: UploadType[] = ["shorts", "livestreams"]

    const channelId = await getChannelId(handle)

    const playlistIds = await getPlaylistId(channelId, uploadTypes);

    const videoIds = await getVideoIds(playlistIds);

    const videos = await getVideoInfo(videoIds);

    if (Boolean(Object.keys(videos).length)) {
        const sortedEntries = Object.entries(videos).sort(([, a], [, b]) => b.NumericDate - a.NumericDate)

        const sortedVideos = Object.fromEntries(sortedEntries)
        createVideoCsv(sortedVideos, handle);
    }

    else {
        if (uploadTypes.length == 3) {
            console.log("######## No Videos #########")
            console.log(`No uploads of any type found for channel ${handle}`)
        }
        
         else {
            console.log("######## No Videos of Type #########")
            console.log(`No ${uploadTypes.join(', ')} found for channel ${handle}`)
         }
    }
    
}


main()