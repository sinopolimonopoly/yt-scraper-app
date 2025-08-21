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
exports.getChannelId = getChannelId;
// export so the function can be used elsewhere
// async because function returns a promise (a value that is not known right away)
// string type for parameter because this is Typescript
// Promise<string> describes the function outputting a string
function getChannelId(apiKey, handle) {
    return __awaiter(this, void 0, void 0, function () {
        var handleVerified, validIdx, verifiedChannelId, url, res, data, _i, _a, _b, idx, item, currentChannelId, handleUrl, currentResponse, currentChannelData, dataHandle;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    handleVerified = false;
                    url = "https://www.googleapis.com/youtube/v3/search?&type=channel&q=".concat(handle, "&key=").concat(apiKey);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _c.sent();
                    _i = 0, _a = data.items.entries();
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    _b = _a[_i], idx = _b[0], item = _b[1];
                    console.log("channel id idx", idx);
                    currentChannelId = item.id.channelId;
                    handleUrl = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=".concat(currentChannelId, "&key=").concat(apiKey);
                    return [4 /*yield*/, fetch(handleUrl)];
                case 4:
                    currentResponse = _c.sent();
                    return [4 /*yield*/, currentResponse.json()];
                case 5:
                    currentChannelData = _c.sent();
                    dataHandle = currentChannelData.items[0].snippet.customUrl;
                    console.log(idx, item);
                    console.log("current handle:", dataHandle);
                    if (dataHandle.toLowerCase().replace("@", "") == handle.toLowerCase()) {
                        handleVerified = true;
                        validIdx = idx;
                        return [3 /*break*/, 7];
                    }
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    if (handleVerified) {
                        verifiedChannelId = data.items[validIdx].id.channelId;
                        return [2 /*return*/, verifiedChannelId];
                    }
                    else {
                        console.log("No channel found with handle: ".concat(handle, "."));
                        return [2 /*return*/, ""];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
