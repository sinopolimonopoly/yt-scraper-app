import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const safeText = (text: any) => `"${String(text).replace(/"/g, '""')}"`;

export function createVideoCsv(videos: Record<string, any>, input: string, isChannel: boolean) {

    let filePath
    let headers

    if (isChannel == true) {
        filePath = path.join(process.cwd(), 'data', `${input}_output.csv`);

        headers = ["videoId", "Title", "UploadDate", "VideoType", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"]
    }

    else {
        filePath = path.join(process.cwd(), 'data', `${input}_playlist.csv`);

        headers = ["videoId", "Title", "UploadDate", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"]
    }
    

    fs.writeFileSync(filePath, headers.join(",") + "\n", 'utf-8')

    for (const [videoId, videoInfo] of Object.entries(videos)) {
        let row
        const title = safeText(videoInfo.Title);
        const uploadDate = videoInfo.UploadDate;
        const videoType = videoInfo.VideoType;
        const duration = videoInfo.Duration;
        const durationInS = videoInfo.DurationInS;
        const viewCount = videoInfo.ViewCount;
        const likeCount = videoInfo.LikeCount;
        const commentCount = videoInfo.CommentCount;

        if (isChannel == true) {
            row =`${videoId},${title},${uploadDate},${videoType},${duration},${durationInS},${viewCount},${likeCount},${commentCount}` + "\n"
        }

        else {
            row =`${videoId},${title},${uploadDate},${duration},${durationInS},${viewCount},${likeCount},${commentCount}` + "\n"
        }

        fs.appendFileSync(filePath, row, "utf-8");
    }

}