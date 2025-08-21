"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoCsv = createVideoCsv;
var fs = require("fs");
var path_1 = require("path");
var safeText = function (text) { return "\"".concat(String(text).replace(/"/g, '""'), "\""); };
function createVideoCsv(videos, input, isChannel) {
    var filePath;
    var headers;
    if (isChannel == true) {
        filePath = path_1.default.join(process.cwd(), 'data', "".concat(input, "_output.csv"));
        headers = ["videoId", "Title", "UploadDate", "VideoType", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"];
    }
    else {
        filePath = path_1.default.join(process.cwd(), 'data', "".concat(input, "_playlist.csv"));
        headers = ["videoId", "Title", "UploadDate", "Duration", "DurationInS", "ViewCount", "LikeCount", "CommentCount"];
    }
    fs.writeFileSync(filePath, headers.join(",") + "\n", 'utf-8');
    for (var _i = 0, _a = Object.entries(videos); _i < _a.length; _i++) {
        var _b = _a[_i], videoId = _b[0], videoInfo = _b[1];
        var row = void 0;
        var title = safeText(videoInfo.Title);
        var uploadDate = videoInfo.UploadDate;
        var videoType = videoInfo.VideoType;
        var duration = videoInfo.Duration;
        var durationInS = videoInfo.DurationInS;
        var viewCount = videoInfo.ViewCount;
        var likeCount = videoInfo.LikeCount;
        var commentCount = videoInfo.CommentCount;
        if (isChannel == true) {
            row = "".concat(videoId, ",").concat(title, ",").concat(uploadDate, ",").concat(videoType, ",").concat(duration, ",").concat(durationInS, ",").concat(viewCount, ",").concat(likeCount, ",").concat(commentCount) + "\n";
        }
        else {
            row = "".concat(videoId, ",").concat(title, ",").concat(uploadDate, ",").concat(duration, ",").concat(durationInS, ",").concat(viewCount, ",").concat(likeCount, ",").concat(commentCount) + "\n";
        }
        fs.appendFileSync(filePath, row, "utf-8");
    }
}
