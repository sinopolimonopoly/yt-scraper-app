import express from 'express';
import cors from 'cors';
import path from 'path';

import getVideos from './src/scripts/mainScripts/getVideosMainApp.js';
import { UploadType } from './src/scripts/apiScripts/playlistIdGetter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
  console.log("Guys I think it's working");
});

app.post('/api/get-videos', async (req, res) => {
    try {

        console.log("req.body", req.body);
        const { channelId, uploadTypes } = req.body;

        console.log("channel id", channelId);
        console.log("upload types", uploadTypes);

        const result = await getVideos(channelId, uploadTypes);

        res.json(result);
        
    } catch (err: any) {
        console.log("BACK END SERVER TS ERROR");
        console.error("Error: ", err)

    }
}); 


app.get('/api/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'data', filename)

    res.download(filePath, filename, (err) => {
        if (err) {
            console.log("API DOWNLOAD FILE ERROR")
            console.error("Error:", err);
            res.status(500).send("Error downloading file");
        }
    });
})