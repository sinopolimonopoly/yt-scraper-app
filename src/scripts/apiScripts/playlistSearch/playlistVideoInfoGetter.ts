import { createDefaultDict } from "../../helpers/defaultdict.js";
import { processDuration } from "../../helpers/durationProcessor.js";

interface PlaylistVideo {
    title: string;
    uploadDate: string;
    numericDate: number;
    duration: string;
    durationInS: number | string;
    viewCount: number | string;
    likeCount: number | string;
    commentCount: number | string;
}

export interface PlaylistVideoResults {
    results: {
        [key: string]: PlaylistVideo;
    } | null;
    error: boolean;
    errorMessage: string;
}

export async function getPlaylistVideosInfo(apiKey: string, videoIds: Array<string>): Promise<PlaylistVideoResults> {
    let videos = createDefaultDict<PlaylistVideo>(() => ({
        title: "",
        uploadDate: "",
        numericDate: 0,
        duration: "",
        durationInS: 0,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
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
                    results: null,
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
                videos[videoId].title = title;
                videos[videoId].uploadDate = uploadDate;
                videos[videoId].numericDate = Number(uploadDate.replaceAll("-", ""));

                videos[videoId].duration = rawDuration;
                videos[videoId].durationInS = processedDuration;

                videos[videoId].viewCount = viewCount;
                videos[videoId].likeCount = likeCount;
                videos[videoId].commentCount = commentCount;
            }

            catch (err) {
                console.log("---------- Video Info Error -----------");
                console.error("Error retrieving video information", err);
                console.log(item);
            }
        }
    }

     return {
        results: videos,
        error: false,
        errorMessage: ""
    }
    
}