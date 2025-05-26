import { createDefaultDict } from "../helpers/defaultdict.js";

export async function getChannelIdInfo(channelId: string, apiKey: string): Promise<object> {
    
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`

    const res = await fetch(url);
    const data = await res.json();

    const channelInfo = createDefaultDict<string>(()=> "");

    channelInfo["ChannelName"] = data.items[0].snippet.title;
    channelInfo["Handle"] = data.items[0].snippet.customUrl;
    channelInfo["JoinDate"] = data.items[0].snippet.publishedAt.slice(0,10);
    channelInfo["Description"] = data.items[0].snippet.description;
    channelInfo["ThumbnailUrl"] = data.items[0].snippet.thumbnails.high.url.replace("=s800", "=s150")

    channelInfo["SubCount"] = data.items[0].statistics.subscriberCount;
    channelInfo["ViewCount"] = data.items[0].statistics.viewCount;
    channelInfo["VideoCount"] = data.items[0].statistics.videoCount;

    return channelInfo;
}