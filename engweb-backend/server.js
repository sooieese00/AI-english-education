const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
const { getVideoCaptions, getCaptionText, saveCaption, getCaption, getChatResponse } = require('./services/youtubeService');

// 환경 변수 설정
dotenv.config();

// MongoDB 연결
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 사용자 라우트
app.use('/api/users', userRoutes);

// 유튜브 라우트
app.use('/api/youtube', youtubeRoutes);

// PlayHT 라우트
app.use('/api/playht', playhtRoutes);

// 유튜브 비디오 처리 엔드포인트
app.get('/process/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        // Step 1: Fetch captions
        const captions = await getVideoCaptions(videoId);

        if (captions.length === 0) {
            return res.status(404).send('No captions found for this video.');
        }

        // Step 2: Fetch caption text and save it to the database
        const captionText = await getCaptionText(videoId);
        await saveCaption(videoId, captions[0].id, captionText);

        // Step 3: Get the caption from the database
        const savedCaption = await getCaption(videoId);

        // Step 4: Get chat response
        const chatResponse = await getChatResponse(savedCaption.text);
        res.send({ chatResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
