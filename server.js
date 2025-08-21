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
var express_1 = require("express");
var cors_1 = require("cors");
var path_1 = require("path");
var getChannelInfoMain_js_1 = require("./src/scripts/mainScripts/getChannelInfoMain.js");
var getVideosMainApp_js_1 = require("./src/scripts/mainScripts/getVideosMainApp.js");
var getPlaylistInfo_js_1 = require("./src/scripts/mainScripts/getPlaylistInfo.js");
var getPlaylistVideos_js_1 = require("./src/scripts/mainScripts/getPlaylistVideos.js");
var app = (0, express_1.default)();
app.use(function (req, res, next) {
    console.log("Incoming Origin:", req.headers.origin);
    next();
});
app.use((0, cors_1.default)());
app.options('/api/*', (0, cors_1.default)());
app.use(express_1.default.json());
app.listen(3001, '0.0.0.0', function () {
    console.log("Server running on http://localhost:3001");
    console.log("Guys I think it's working");
});
app.post('/api/get-channel-info', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var channelHandle, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                channelHandle = req.body.channelHandle;
                return [4 /*yield*/, (0, getChannelInfoMain_js_1.default)(channelHandle)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log("BACK END GET CHANNEL INFO ERROR");
                console.error("Error: ", err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/get-channel-videos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, channelHandle, uploadTypes, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log("req.body", req.body);
                _a = req.body, channelHandle = _a.channelHandle, uploadTypes = _a.uploadTypes;
                console.log("Provided handle:", channelHandle);
                console.log("Specified upload types:", uploadTypes);
                return [4 /*yield*/, (0, getVideosMainApp_js_1.default)(channelHandle, uploadTypes)];
            case 1:
                result = _b.sent();
                console.log(result);
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                console.log("BACK END GET VIDEOS ERROR");
                console.error("Error: ", err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/get-playlist-info', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                playlistId = req.body.playlistId;
                return [4 /*yield*/, (0, getPlaylistInfo_js_1.default)(playlistId)];
            case 1:
                result = _a.sent();
                console.log("BACK END PLIST INFO RESULTS: ", result);
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log("BACK END GET PLIST INFO ERROR");
                console.error("Error: ", err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/get-playlist-videos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, playlistId, channel, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, playlistId = _a.playlistId, channel = _a.channel;
                return [4 /*yield*/, (0, getPlaylistVideos_js_1.default)(playlistId, channel)];
            case 1:
                result = _b.sent();
                console.log("BACK END PLIST VIDEO RESULTS: ", result);
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                console.log("BACK END GET PLIST INFO ERROR");
                console.error("Error: ", err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/download/:filename', function (req, res) {
    var filename = req.params.filename;
    var filePath = path_1.default.join(process.cwd(), 'data', filename);
    res.download(filePath, filename, function (err) {
        if (err) {
            console.log("API DOWNLOAD FILE ERROR");
            console.error("Error:", err);
            res.status(500).send("Error downloading file");
        }
    });
});
