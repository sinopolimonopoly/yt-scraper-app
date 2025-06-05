interface PlaylistVideoIdsInterface {
    videoIds: Array<string> | null;
    error: boolean;
    errorMessage: string;
}

export async function getVideoIds(apiKey: string, playlistId: string): Promise<PlaylistVideoIdsInterface> {

    let playlistVideoIds = []
    let nextPageToken = null;  
    

    while (true) {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

        if (nextPageToken) {
            url += `&pageToken=${nextPageToken}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if ("error" in data) {
            console.log("Error with API call")  
            console.error(data.error.message)
            return {
                videoIds: null,
                error: true,
                errorMessage: `Error message: ${data.error.message}`
            };
        }

        for (const item of data.items) {
            
            if ((item.snippet.title == "Deleted Video") && (item.snippet.description == "This video is unavailable.")) {
                continue
            }
            
            let videoId = item.snippet.resourceId.videoId
            playlistVideoIds.push(videoId)
            
        }
        
        nextPageToken = data.nextPageToken

        if (!(nextPageToken)) {
            break
        }
    }        

    return {
        videoIds: playlistVideoIds,
        error: false,
        errorMessage: ""
    }
}
