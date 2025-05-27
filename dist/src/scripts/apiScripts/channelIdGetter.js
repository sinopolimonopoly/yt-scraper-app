// export so the function can be used elsewhere
// async because function returns a promise (a value that is not known right away)
// string type for parameter because this is Typescript
// Promise<string> describes the function outputting a string
export async function getChannelId(apiKey, handle) {
    let handleVerified = false;
    let validIdx;
    let verifiedChannelId;
    let url = `https://www.googleapis.com/youtube/v3/search?&type=channel&q=${handle}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    for (const [idx, item] of data.items.entries()) {
        console.log("channel id idx", idx);
        let currentChannelId = item.id.channelId;
        let handleUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${currentChannelId}&key=${apiKey}`;
        let currentResponse = await fetch(handleUrl);
        let currentChannelData = await currentResponse.json();
        let dataHandle = currentChannelData.items[0].snippet.customUrl;
        console.log(idx, item);
        console.log("current handle:", dataHandle);
        if (dataHandle.toLowerCase().replace("@", "") == handle.toLowerCase()) {
            handleVerified = true;
            validIdx = idx;
            break;
        }
    }
    if (handleVerified) {
        verifiedChannelId = data.items[validIdx].id.channelId;
        return verifiedChannelId;
    }
    else {
        console.log(`No channel found with handle: ${handle}.`);
        return "";
    }
}
