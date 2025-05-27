import getChannelInfo from './getChannelInfoMain.js';
import getVideos from './getVideosMainApp.js';

import { UploadType } from "../apiScripts/playlistIdGetter.js";


async function getChannelEverything(handle: string, uploadTypes: UploadType[]) {

    const channelInfoResult = getChannelInfo(handle);

    const getVideosResult = getVideos(handle, uploadTypes);


}