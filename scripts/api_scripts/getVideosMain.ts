import { getChannelId } from "./channelIdGetter";
import { getPlaylistId } from "./playlistIdGetter";
import { getVideoIds } from "./videoIdGetter";

async function main() {
    const handle = "curtisdoingthings"

    const channelId = await getChannelId(handle)

    const playlistIds = await getPlaylistId(channelId, "all")

    const videoIds = await getVideoIds(playlistIds)

}

main()