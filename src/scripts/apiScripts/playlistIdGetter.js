"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylistId = getPlaylistId;
var defaultdict_js_1 = require("../helpers/defaultdict.js");
// No need for async or promise because no await within function
function getPlaylistId(channelId, uploadTypes) {
    // Playlist Ids are same as channel ids with different prefixes
    var longFormId = "UULF" + channelId.slice(2);
    var shortsId = "UUSH" + channelId.slice(2);
    var livestreamId = "UULV" + channelId.slice(2);
    var playlistIdObject = {
        videos: longFormId,
        shorts: shortsId,
        livestreams: livestreamId
    };
    console.log(uploadTypes);
    if (uploadTypes.length == 3) {
        return playlistIdObject;
    }
    var playlistIds = (0, defaultdict_js_1.createDefaultDict)(function () { return ""; });
    for (var _i = 0, uploadTypes_1 = uploadTypes; _i < uploadTypes_1.length; _i++) {
        var vidType = uploadTypes_1[_i];
        playlistIds[vidType] = playlistIdObject[vidType];
    }
    return playlistIds;
}
