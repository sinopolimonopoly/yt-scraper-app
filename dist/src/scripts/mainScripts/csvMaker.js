import * as fs from 'fs';
import path from 'path';
const safeText = (text) => `"${String(text).replace(/"/g, '""')}"`;
export function createVideoCsv(videos, handle) {
    const filePath = path.join(process.cwd(), 'data', `${handle}_output.csv`);
    const headers = ["videoId", "Title", "UploadDate", "VideoType", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"];
    fs.writeFileSync(filePath, headers.join(",") + "\n", 'utf-8');
    for (const [videoId, videoInfo] of Object.entries(videos)) {
        const title = safeText(videoInfo.Title);
        const uploadDate = videoInfo.UploadDate;
        const videoType = videoInfo.VideoType;
        const duration = videoInfo.Duration;
        const durationInS = videoInfo.DurationinS;
        const viewCount = videoInfo.ViewCount;
        const likeCount = videoInfo.LikeCount;
        const commentCount = videoInfo.CommentCount;
        const row = `${videoId},${title},${uploadDate},${videoType},${duration},${durationInS},${viewCount},${likeCount},${commentCount}` + "\n";
        fs.appendFileSync(filePath, row, "utf-8");
    }
}
