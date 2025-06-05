export async function getPlaylistInfo(apiKey, playlistId) {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.pageInfo.totalResults == 0) {
        return {
            info: null,
            error: false,
            errorMessage: ""
        };
    }
    return {
        info: {
            title: data.items[0].snippet.title,
            description: data.items[0].snippet.description,
            createDate: data.items[0].snippet.publishedAt.slice(0, 10),
            channel: data.items[0].snippet.channelTitle,
            videoCount: data.items[0].contentDetails.itemCount
        },
        error: false,
        errorMessage: ""
    };
}
