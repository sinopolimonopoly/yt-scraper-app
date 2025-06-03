import { createDefaultDict } from "../helpers/defaultdict.js";
export async function getVideoIds(
// Defining expected types of parameters
apiKey, 
// ? means optional
playlistIds, maxResults = 50) {
    // || is or in Typescript
    if (maxResults < 1 || maxResults > 50) {
        throw new Error("Please enter a valid results value between 1 and 50. 50 is recommended for highest efficiency.");
    }
    let videoIds = createDefaultDict(() => []);
    for (const [vidType, playlist] of Object.entries(playlistIds)) {
        let typeIds = [];
        let nextPageToken = null;
        while (true) {
            let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlist}&key=${apiKey}`;
            if (nextPageToken) {
                url += `&pageToken=${nextPageToken}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if ("error" in data) {
                console.log(`${vidType} | Can't retrieve ${vidType}. Desired playlist may be empty.`);
                break;
            }
            for (const item of data.items) {
                if ((vidType == "videos") || (vidType == "shorts")) {
                    let thumbnailUrl = item.snippet.thumbnails.default.url;
                    if (thumbnailUrl.includes("default_live.")) {
                        continue;
                    }
                }
                let videoId = item.snippet.resourceId.videoId;
                typeIds.push(videoId);
            }
            nextPageToken = data.nextPageToken;
            if (!(nextPageToken)) {
                break;
            }
        }
        videoIds[vidType] = typeIds;
    }
    return videoIds;
}
