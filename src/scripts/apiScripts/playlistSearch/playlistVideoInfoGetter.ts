import { createDefaultDict } from "../../helpers/defaultdict.js";
import { processDuration } from "../../helpers/durationProcessor.js";

interface PlaylistVideo {
    Title: string;
    UploadDate: string;
    NumericDate: number;
    Duration: string;
    DurationInS: number | string;
    ViewCount: number | string;
    LikeCount: number | string;
    CommentCount: number | string;
}

export interface PlaylistVideoResults {
    result: {
        [key: string]: PlaylistVideo;
    } | null;
    error: boolean;
    errorMessage: string;
}

export async function getPlaylistVideosInfo(apiKey: string, videoIds: Array<string>): Promise<PlaylistVideoResults> {
    let videos = createDefaultDict<PlaylistVideo>(() => ({
        Title: "",
        UploadDate: "",
        NumericDate: 0,
        Duration: "",
        DurationInS: 0,
        ViewCount: 0,
        LikeCount: 0,
        CommentCount: 0,
    }));

    for (let i = 0; i < videoIds.length; i += 50) {
        let batch = videoIds.slice(i, i+50);
        let commaSepIds = batch.join(',');
        let data;

        try {
            let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${commaSepIds}&key=${apiKey}`;
            
            let res = await fetch(url);
            data = await res.json();    
        }

        catch (err) {
            console.log("!!!! API Call Error !!!!")
            console.error("Error w API call:", err)
            return {
                    result: null,
                    error: true,
                    errorMessage: `Error message: ${err}`
                }
        }

        for (const item of data.items) {
            try {
                // Basic Information
                let videoId = item.id;
                let title = item.snippet.title; 
                let uploadDate = item.snippet.publishedAt.slice(0, 10);

                let rawDuration: string;
                let processedDuration;

                let likeCount;
                let commentCount;

                // Duration
                if (item.snippet.liveBroadcastContent == "live") {
                    rawDuration = "Currently live";
                    processedDuration = "Currently live";
                }

                else if (item.snippet.liveBroadcastContent == "upcoming") {
                    continue;
                }

                else {
                    rawDuration = item.contentDetails.duration.replace("P","").replace("T","")
                    processedDuration = processDuration(rawDuration, item);
                }

                // Statistics
                let viewCount = Number(item.statistics.viewCount);

                if ("likeCount" in item.statistics) {
                    likeCount = Number(item.statistics.likeCount);
                }  
                else {
                    likeCount = "Disabled";
                }

                if ("commentCount" in item.statistics) {
                    commentCount = Number(item.statistics.commentCount);
                }  
                else {
                    commentCount = "Disabled";
                }

                // Assigning data to current video ID object
                videos[videoId].Title = title;
                videos[videoId].UploadDate = uploadDate;
                videos[videoId].NumericDate = Number(uploadDate.replaceAll("-", ""));

                videos[videoId].Duration = rawDuration;
                videos[videoId].DurationInS = processedDuration;

                videos[videoId].ViewCount = viewCount;
                videos[videoId].LikeCount = likeCount;
                videos[videoId].CommentCount = commentCount;
            }

            catch (err) {
                console.log("---------- Video Info Error -----------");
                console.error("Error retrieving video information", err);
                console.log(item);
            }
        }
    }

     return {
        result: videos,
        error: false,
        errorMessage: ""
    }
    
}