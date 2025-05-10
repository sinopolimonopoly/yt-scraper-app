import dotenv from "dotenv";
dotenv.config();

const api_key = process.env.API_KEY;

// export so the function can be used elsewhere
// async because function returns a promise (a value that is not known right away)
// string type for parameter because this is Typescript
// Promise<string> describes the function outputting a string
export async function getChannelId(handle: string): Promise<string> {
    let url = `https://www.googleapis.com/youtube/v3/search?&type=channel&q=${handle}&key=${api_key}`;

    const res = await fetch(url);
    const data = await res.json();

    const channelID = data.items[0].id.channelId

    return channelID
}
