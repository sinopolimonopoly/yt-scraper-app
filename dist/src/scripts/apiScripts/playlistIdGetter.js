import { createDefaultDict } from "../helpers/defaultdict.js";
// No need for async or promise because no await within function
export function getPlaylistId(channelId, uploadTypes) {
    // Playlist Ids are same as channel ids with different prefixes
    const longFormId = "UULF" + channelId.slice(2);
    const shortsId = "UUSH" + channelId.slice(2);
    const livestreamId = "UULV" + channelId.slice(2);
    const playlistIdObject = {
        videos: longFormId,
        shorts: shortsId,
        livestreams: livestreamId
    };
    console.log(uploadTypes);
    if (uploadTypes.length == 3) {
        return playlistIdObject;
    }
    const playlistIds = createDefaultDict(() => "");
    for (const vidType of uploadTypes) {
        playlistIds[vidType] = playlistIdObject[vidType];
    }
    return playlistIds;
}
