export async function getChannelIdInfo(channelId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
        ChannelName: data.items[0].snippet.title,
        Handle: data.items[0].snippet.customUrl,
        JoinDate: data.items[0].snippet.publishedAt.slice(0, 10),
        Description: data.items[0].snippet.description,
        ThumbnailUrl: data.items[0].snippet.thumbnails.high.url.replace("=s800", "=s130"),
        SubCount: Number(data.items[0].statistics.subscriberCount),
        ViewCount: Number(data.items[0].statistics.viewCount),
        VideoCount: Number(data.items[0].statistics.videoCount)
    };
}
