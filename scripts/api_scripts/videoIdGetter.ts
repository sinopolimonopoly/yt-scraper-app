import dotenv from "dotenv";
dotenv.config();

const api_key = process.env.API_KEY;

import { createDefaultDict } from "../helpers/defaultdict";

export async function getVideoIds(
    // Defining expected types of parameters
    // ? means optional
    playlistIds: {
        videos?: string;
        shorts?: string;
        livestreams?: string;
    }, 
    maxResults = 50
): Promise<Record<string, string[]>> {
    // || is or in Typescript
    if (maxResults < 1 || maxResults > 50) {
        throw new Error ("Please enter a valid results value between 1 and 50. 50 is recommended for highest efficiency.");
    }

    let videoIds = createDefaultDict<string[]>(() => []);

    let nextPageToken = null;

    for (const [vidType, playlist] of Object.entries(playlistIds)) {
        let typeIds = [];
        while (true) {
            let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlist}&key=${api_key}`;

            if (Boolean(nextPageToken)) {
                url += `&pageToken=${nextPageToken}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if ("error" in data) {
                let currentType = (
                    vidType == "videos" ? "Videos" :
                    vidType == "shorts" ? "Shorts" :
                    vidType == "livestreams" ? "Livestreams":
                    "INVALID VIDEO TYPE"
                )
                console.log(`${vidType} | Can't retrieve ${currentType}. Desired playlist may be empty.`);

                break;
            }

            for (const item of data.items) {
                
                if ((vidType == "videos") || (vidType == "shorts")) {

                    let thumbnailUrl = item.snippet.thumbnails.default.url  

                    if ("default_live." in thumbnailUrl) {
                        continue
                    }
                }
                
                let videoId = item.snippet.resourceId.videoId
                typeIds.push(videoId)
            }
            
            let nextPageToken = data.get('nextPageToken')

            if (!(nextPageToken)) {
                break
            }

        videoIds[vidType] = typeIds
            
        }
        
    }

    return videoIds
}
