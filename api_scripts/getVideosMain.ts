import { getChannelId } from "./channelIdGetter";

async function main() {
    const handle = "CGPGrey"

    const chanId = await getChannelId(handle)

    console.log(chanId)
}

main()