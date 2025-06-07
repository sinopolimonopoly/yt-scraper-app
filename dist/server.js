import express from 'express';
import cors from 'cors';
import path from 'path';
import getChannelInfo from './src/scripts/mainScripts/getChannelInfoMain.js';
import getVideos from './src/scripts/mainScripts/getVideosMainApp.js';
import getPlaylistInfo from './src/scripts/mainScripts/getPlaylistInfo.js';
import getPlaylistVideos from './src/scripts/mainScripts/getPlaylistVideos.js';
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3001, '0.0.0.0', () => {
    console.log("Server running on http://localhost:3001");
    console.log("Guys I think it's working");
});
app.post('/api/get-channel-info', async (req, res) => {
    try {
        const { channelHandle } = req.body;
        const result = await getChannelInfo(channelHandle);
        console.log("before res jsoning", result);
        res.json(result);
        console.log("server ts output", result);
    }
    catch (err) {
        console.log("BACK END GET CHANNEL INFO ERROR");
        console.error("Error: ", err);
    }
});
app.post('/api/get-channel-videos', async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { channelHandle, uploadTypes } = req.body;
        console.log("Provided handle:", channelHandle);
        console.log("Specified upload types:", uploadTypes);
        const result = await getVideos(channelHandle, uploadTypes);
        res.json(result);
    }
    catch (err) {
        console.log("BACK END GET VIDEOS ERROR");
        console.error("Error: ", err);
    }
});
app.post('/api/get-playlist-info', async (req, res) => {
    try {
        const { playlistId } = req.body;
        const result = await getPlaylistInfo(playlistId);
        console.log("BACK END PLIST INFO RESULTS: ", result);
        res.json(result);
    }
    catch (err) {
        console.log("BACK END GET PLIST INFO ERROR");
        console.error("Error: ", err);
    }
});
app.post('/api/get-playlist-videos', async (req, res) => {
    try {
        const { playlistId, channel } = req.body;
        const result = await getPlaylistVideos(playlistId, channel);
        console.log("BACK END PLIST VIDEO RESULTS: ", result);
        res.json(result);
    }
    catch (err) {
        console.log("BACK END GET PLIST INFO ERROR");
        console.error("Error: ", err);
    }
});
app.get('/api/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'data', filename);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.log("API DOWNLOAD FILE ERROR");
            console.error("Error:", err);
            res.status(500).send("Error downloading file");
        }
    });
});
