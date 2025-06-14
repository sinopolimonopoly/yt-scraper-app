import { createDefaultDict } from "../helpers/defaultdict.js";
import { processDuration } from "../helpers/durationProcessor.js";

import { VideoInterface } from "../helpers/interfaces.js";
import { VidCountInterface } from "../helpers/interfaces.js";

interface ChannelVidReturn {
    videoResults: Record<string, VideoInterface>;
    vidCounts: VidCountInterface;
}

export async function getVideoInfo(apiKey: string,
    videoIds : {
        videos?: string[];
        shorts?: string[];
        livestreams?: string[];
    }
): Promise<ChannelVidReturn | null> {

    let videos = createDefaultDict<VideoInterface>(() => ({
        Title: "",
        UploadDate: "",
        NumericDate: 0,
        VideoType: "",
        Duration: "",
        DurationInS: 0,
        ViewCount: 0,
        LikeCount: 0,
        CommentCount: 0,
    }));

    let typeCounts: VidCountInterface = {
        LongForms: 0,
        Shorts: 0,
        Livestreams: 0
    }

    typeCounts.LongForms = 0

    for (const[vidType, idList] of Object.entries(videoIds)) { 
        let currentTypeCount = 0

        for (let i = 0; i < idList.length; i += 50) {

            let batch = idList.slice(i, i+50);

            let commaSepIds = batch.join(",");

            let data;

            try {
                let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${commaSepIds}&key=${apiKey}`

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
                    let videoType = (
                        vidType == "videos" ? "Long Form" :
                        vidType == "shorts" ? "Short" :
                        vidType == "livestreams" ? "Livestream" :
                        null
                    ) ;
                    videos[videoId].VideoType = videoType;

                    videos[videoId].Duration = rawDuration;
                    videos[videoId].DurationInS = processedDuration;

                    videos[videoId].ViewCount = viewCount;
                    videos[videoId].LikeCount = likeCount;
                    videos[videoId].CommentCount = commentCount;

                    currentTypeCount += 1
                }

                catch (error) {
                    console.log("---------- Video Info Error -----------");
                    console.error("Error retrieving video information", error);
                    console.log(item);
                }
            }
        }

        if (vidType == "videos") {
            typeCounts.LongForms = currentTypeCount  
        }

        else if (vidType == "shorts") {
            typeCounts.Shorts = currentTypeCount  
        }

        else if (vidType == "livestreams") {
            typeCounts.Livestreams = currentTypeCount  
        }

    }

    return {
        videoResults: videos,
        vidCounts: typeCounts
    }
}
