import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const safeText = (text) => `"${String(text).replace(/"/g, '""')}"`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../../../..');
export function createVideoCsv(videos, handle) {
    const filePath = `${handle}_output.csv`;
    const filePath2 = path.join(projectRoot, 'data', `${handle}_output.csv`);
    const headers = ["videoId", "Title", "UploadDate", "VideoType", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"];
    fs.writeFileSync(filePath2, headers.join(",") + "\n", 'utf-8');
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
        fs.appendFileSync(filePath2, row, "utf-8");
    }
}
