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
var playlistVideoIdGetter_js_1 = require("../apiScripts/playlistSearch/playlistVideoIdGetter.js");
var playlistVideoInfoGetter_js_1 = require("../apiScripts/playlistSearch/playlistVideoInfoGetter.js");
var csvMaker_js_1 = require("./csvMaker.js");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var apiKey = process.env.API_KEY;
if (!apiKey)
    throw new Error("Missing API_KEY in environment variables");
function getPlaylistVideos(playlistId, channel) {
    return __awaiter(this, void 0, void 0, function () {
        var playlistVidIds, playlistVideos;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, playlistVideoIdGetter_js_1.getPlaylistVideoIds)(apiKey, playlistId)];
                case 1:
                    playlistVidIds = _b.sent();
                    if (playlistVidIds.error == true) {
                        return [2 /*return*/, {
                                result: null,
                                error: true,
                                errorMessage: playlistVidIds.errorMessage
                            }];
                    }
                    return [4 /*yield*/, (0, playlistVideoInfoGetter_js_1.getPlaylistVideosInfo)(apiKey, (_a = playlistVidIds.videoIds) !== null && _a !== void 0 ? _a : [])];
                case 2:
                    playlistVideos = _b.sent();
                    if (playlistVideos.error == true) {
                        return [2 /*return*/, {
                                result: null,
                                error: true,
                                errorMessage: playlistVideos.errorMessage
                            }];
                    }
                    else if (playlistVideos.result) {
                        (0, csvMaker_js_1.createVideoCsv)(playlistVideos.result, channel.split(" ").join("_"), false);
                        return [2 /*return*/, playlistVideos];
                    }
                    else {
                        return [2 /*return*/, {
                                result: null,
                                error: true,
                                errorMessage: "No idea how we got here I'll be real"
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = getPlaylistVideos;
