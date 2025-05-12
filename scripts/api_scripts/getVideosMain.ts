import { getChannelId } from "./channelIdGetter";
import { getPlaylistId } from "./playlistIdGetter";
import { getVideoIds } from "./videoIdGetter";
import { getVideoInfo } from "./videoInfoGetter";

async function main() {
    const handle = "AsumSaus"

    const channelId = await getChannelId(handle)

    const playlistIds = await getPlaylistId(channelId, "all");

    const videoIds = await getVideoIds(playlistIds);

    const videos = await getVideoInfo(videoIds);

    const sortedEntries = Object.entries(videos).sort(([, a], [, b]) => b.NumericDate - a.NumericDate)

    console.log(sortedEntries)
}

main()