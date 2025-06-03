import getChannelInfo from './getChannelInfoMain.js';
import getVideos from './getVideosMainApp.js';
async function getChannelEverything(handle, uploadTypes) {
    const channelInfoResult = getChannelInfo(handle);
    const getVideosResult = getVideos(handle, uploadTypes);
}
