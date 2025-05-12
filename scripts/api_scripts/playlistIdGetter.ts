// No need for async or promise because no await within function
export function getPlaylistId(channelId: string, uploadType = "all"): {
    // Allowing for keys to be present or absent depending on parameter values
    videos?: string;
    shorts?: string;
    livestreams?: string;
} {
    // Playlist Ids are same as channel ids with different prefixes
    const longFormId = "UULF" + channelId.slice(2);
    const shortsId = "UUSH" + channelId.slice(2);
    const livestreamId = "UULV" + channelId.slice(2);

    // Return playlist Id(s) based on specified upload type 
    if (uploadType == "videos") {
        return { videos: longFormId }
    }

    else if (uploadType == "shorts") {
        return { shorts: shortsId }
    }

    else if (uploadType == "livestreams") {
        return { livestreams: livestreamId }
    }

    else {
        return {
            videos: longFormId,
            shorts: shortsId, 
            livestreams: livestreamId
        }
    }
}