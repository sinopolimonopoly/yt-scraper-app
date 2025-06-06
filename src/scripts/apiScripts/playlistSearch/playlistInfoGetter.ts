interface PlaylistInfo {
    title: string;
    description: string;
    createDate: string;
    channel: string;
    videoCount: number;
}

export interface PlaylistInfoInterface {
    results: PlaylistInfo | null;
    error: Boolean;
    errorMessage: string;
}

export async function retrievePlaylistInfo(apiKey: string, playlistId: string): Promise<PlaylistInfoInterface> {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`

    const res = await fetch(url);
    const data = await res.json();

    if (data.pageInfo.totalResults == 0) {
        return {
            results: null,
            error: false,
            errorMessage: ""
        }
    } 

    return {
        results: {
            title: data.items[0].snippet.title,
            description: data.items[0].snippet.description,
            createDate: data.items[0].snippet.publishedAt.slice(0,10),
            channel: data.items[0].snippet.channelTitle,
            videoCount: data.items[0].contentDetails.itemCount
        },
        error: false,
        errorMessage: ""
    }
}