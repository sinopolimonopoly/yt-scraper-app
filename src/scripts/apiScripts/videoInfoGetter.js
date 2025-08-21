"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoInfo = getVideoInfo;
var defaultdict_js_1 = require("../helpers/defaultdict.js");
var durationProcessor_js_1 = require("../helpers/durationProcessor.js");
function getVideoInfo(apiKey, videoIds) {
    return __awaiter(this, void 0, void 0, function () {
        var videos, typeCounts, _i, _a, _b, vidType, idList, currentTypeCount, i, batch, commaSepIds, data, url, res, error_1, _c, _d, item, videoId, title, uploadDate, rawDuration, processedDuration, likeCount, commentCount, viewCount, videoType;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    videos = (0, defaultdict_js_1.createDefaultDict)(function () { return ({
                        Title: "",
                        UploadDate: "",
                        NumericDate: 0,
                        VideoType: "",
                        Duration: "",
                        DurationInS: 0,
                        ViewCount: 0,
                        LikeCount: 0,
                        CommentCount: 0,
                    }); });
                    typeCounts = {
                        LongForms: 0,
                        Shorts: 0,
                        Livestreams: 0
                    };
                    typeCounts.LongForms = 0;
                    _i = 0, _a = Object.entries(videoIds);
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    _b = _a[_i], vidType = _b[0], idList = _b[1];
                    currentTypeCount = 0;
                    i = 0;
                    _e.label = 2;
                case 2:
                    if (!(i < idList.length)) return [3 /*break*/, 9];
                    batch = idList.slice(i, i + 50);
                    commaSepIds = batch.join(",");
                    data = void 0;
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 6, , 7]);
                    url = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=".concat(commaSepIds, "&key=").concat(apiKey);
                    return [4 /*yield*/, fetch(url)];
                case 4:
                    res = _e.sent();
                    return [4 /*yield*/, res.json()];
                case 5:
                    data = _e.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _e.sent();
                    console.log("!!!!!!!!! API Call Error !!!!!!!!!!");
                    console.error("Error with api call", error_1);
                    return [3 /*break*/, 7];
                case 7:
                    for (_c = 0, _d = data.items; _c < _d.length; _c++) {
                        item = _d[_c];
                        try {
                            videoId = item.id;
                            title = item.snippet.title;
                            uploadDate = item.snippet.publishedAt.slice(0, 10);
                            rawDuration = void 0;
                            processedDuration = void 0;
                            likeCount = void 0;
                            commentCount = void 0;
                            // Duration
                            if (item.snippet.liveBroadcastContent == "live") {
                                rawDuration = "Currently live";
                                processedDuration = "Currently live";
                            }
                            else if (item.snippet.liveBroadcastContent == "upcoming") {
                                continue;
                            }
                            else {
                                rawDuration = item.contentDetails.duration.replace("P", "").replace("T", "");
                                processedDuration = (0, durationProcessor_js_1.processDuration)(rawDuration, item);
                            }
                            viewCount = Number(item.statistics.viewCount);
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
                            videoType = (vidType == "videos" ? "Long Form" :
                                vidType == "shorts" ? "Short" :
                                    vidType == "livestreams" ? "Livestream" :
                                        null);
                            videos[videoId].VideoType = videoType;
                            videos[videoId].Duration = rawDuration;
                            videos[videoId].DurationInS = processedDuration;
                            videos[videoId].ViewCount = viewCount;
                            videos[videoId].LikeCount = likeCount;
                            videos[videoId].CommentCount = commentCount;
                            currentTypeCount += 1;
                        }
                        catch (error) {
                            console.log("---------- Video Info Error -----------");
                            console.error("Error retrieving video information", error);
                            console.log(item);
                        }
                    }
                    _e.label = 8;
                case 8:
                    i += 50;
                    return [3 /*break*/, 2];
                case 9:
                    if (vidType == "videos") {
                        typeCounts.LongForms = currentTypeCount;
                    }
                    else if (vidType == "shorts") {
                        typeCounts.Shorts = currentTypeCount;
                    }
                    else if (vidType == "livestreams") {
                        typeCounts.Livestreams = currentTypeCount;
                    }
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/, {
                        videoResults: videos,
                        vidCounts: typeCounts
                    }];
            }
        });
    });
}
