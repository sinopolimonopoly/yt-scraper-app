import { createDefaultDict } from "../helpers/defaultdict.js";

export type UploadType = "videos" | "shorts" | "livestreams";

// No need for async or promise because no await within function
export function getPlaylistId(channelId: string, uploadTypes: UploadType[]): {
    // Allowing for keys to be present or absent depending on parameter values
    videos?: string;
    shorts?: string;
    livestreams?: string;
} {
    // Playlist Ids are same as channel ids with different prefixes
    const longFormId = "UULF" + channelId.slice(2);
    const shortsId = "UUSH" + channelId.slice(2);
    const livestreamId = "UULV" + channelId.slice(2);

    const playlistIdObject: Record<UploadType, string> = {
        videos: longFormId,
        shorts: shortsId,
        livestreams: livestreamId
    }

    console.log(uploadTypes);
    if (uploadTypes.length == 3) {
        return playlistIdObject
    }

    const playlistIds = createDefaultDict<string>(() => "");

    for (const vidType of uploadTypes) {
        playlistIds[vidType] = playlistIdObject[vidType];
    }

    return playlistIds
}