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
exports.getVideoIds = getVideoIds;
var defaultdict_js_1 = require("../helpers/defaultdict.js");
function getVideoIds(apiKey_1, playlistIds_1) {
    return __awaiter(this, arguments, void 0, function (
    // Defining expected types of parameters
    apiKey, 
    // ? means optional
    playlistIds, maxResults) {
        var videoIds, _i, _a, _b, vidType, playlist, typeIds, nextPageToken, url, res, data, _c, _d, item, thumbnailUrl, videoId;
        if (maxResults === void 0) { maxResults = 50; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // || is or in Typescript
                    if (maxResults < 1 || maxResults > 50) {
                        throw new Error("Please enter a valid results value between 1 and 50. 50 is recommended for highest efficiency.");
                    }
                    videoIds = (0, defaultdict_js_1.createDefaultDict)(function () { return []; });
                    _i = 0, _a = Object.entries(playlistIds);
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    _b = _a[_i], vidType = _b[0], playlist = _b[1];
                    typeIds = [];
                    nextPageToken = null;
                    _e.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=".concat(maxResults, "&playlistId=").concat(playlist, "&key=").concat(apiKey);
                    if (nextPageToken) {
                        url += "&pageToken=".concat(nextPageToken);
                    }
                    return [4 /*yield*/, fetch(url)];
                case 3:
                    res = _e.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _e.sent();
                    if ("error" in data) {
                        console.log("".concat(vidType, " | Can't retrieve ").concat(vidType, ". Desired playlist may be empty."));
                        return [3 /*break*/, 5];
                    }
                    for (_c = 0, _d = data.items; _c < _d.length; _c++) {
                        item = _d[_c];
                        if ((vidType == "videos") || (vidType == "shorts")) {
                            thumbnailUrl = item.snippet.thumbnails.default.url;
                            if (thumbnailUrl.includes("default_live.")) {
                                continue;
                            }
                        }
                        videoId = item.snippet.resourceId.videoId;
                        typeIds.push(videoId);
                    }
                    nextPageToken = data.nextPageToken;
                    if (!(nextPageToken)) {
                        return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 2];
                case 5:
                    videoIds[vidType] = typeIds;
                    _e.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, videoIds];
            }
        });
    });
}
