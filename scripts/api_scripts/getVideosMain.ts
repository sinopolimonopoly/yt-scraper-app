import { getChannelId } from "./channelIdGetter";
import { getPlaylistId } from "./playlistIdGetter";

async function main() {
    const handle = "CGPGrey"

    const channelId = await getChannelId(handle)

    const playlistIds = await getPlaylistId(channelId, "all")

    console.log(playlistIds)
}

main()