import dotenv from "dotenv"
dotenv.config();

const api_key = process.env.API_KEY;

import { createDefaultDict } from "../helpers/defaultdict";
import { processDuration } from "../helpers/durationProcessor";

export async function getVideoInfo(
    videoIds : {
        videos?: string[];
        shorts?: string[];
        livestreams?: string[];
    }
): Promise<Record<string, any>> {

    let videos = createDefaultDict<Record<string, any>>(() => ({}));

    for (const[vidType, idList] of Object.entries(videoIds)) {

        for (let i = 0; i < idList.length; i += 50) {

            let batch = idList.slice(i, i+50);

            let commaSepIds = batch.join(",");

            let data;

            try {
                let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${commaSepIds}&key=${api_key}`

                let res = await fetch(url);
                data = await res.json();
            }

            catch (error) {
                console.log("!!!!!!!!! API Call Error !!!!!!!!!!")
                console.error("Error with api call", error)
            }

            for (const item of data.items) {
                try {
                    // Basic Information
                    let videoId = item.id;
                    let title = item.snippet.title; 
                    let uploadDate = item.snippet.publishedAt.slice(0, 10);

                    // Duration
                    if (item.snippet.liveBroadcastContent == "live") {
                        let rawDuration = "Currently live";
                        let processedDuration = "Currently live";
                    }

                    else if (item.snippet.liveBroadcastContent == "upcoming") {
                        continue;
                    }

                    else {
                        let rawDuration = item.contentDetails.duration.replace("P","").replace("T","")
                        let processedDuration = processDuration(rawDuration, item);
                    }

                    // Statistics
                    let viewCount = item.statistics.viewCount

                    if ("likeCount" in item.statistics) {
                        let likeCount = item.statistics.likeCount;
                    }  
                    else {
                        let likeCount = "Disabled";
                    }

                    if ("commentCount" in item.statistics) {
                        let commentCount = item.statistics.commentCount;
                    }  
                    else {
                        let commentCount = "Disabled";
                    }

                    videos[videoId]["Title"] = title;
                    videos[videoId]["Upload Date"] = uploadDate;
                    videos[videoId]["Numeric Date"] = Number(uploadDate.replace("-", ""))
                    
                    
                }
            }
        }


    }


    return videoInfo
}
