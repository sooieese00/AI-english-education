const axios = require('axios');
const Caption = require('../models/Caption');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;

const getVideoCaptions = async (videoId) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/captions`, {
            params: {
                part: 'snippet',
                videoId: videoId,
                key: API_KEY,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching video captions:', error);
        throw error;
    }
};

const getCaptionText = async (videoId) => {
    try {
        const transcript = await getTranscript(videoId);
        const transcriptText = transcript.map(item => item.text).join(' ');
        return transcriptText;
    } catch (error) {
        console.error('Error fetching caption text:', error);
        throw error;
    }
};

const saveCaption = async (videoId, captionId, text) => {
    const caption = new Caption({ videoId, captionId, text });
    await caption.save();
};

const getCaption = async (videoId) => {
    return await Caption.findOne({ videoId });
};

const getChatResponse = async (prompt, expressionLevel, expressionNumber) => {
    const fullPrompt = `난이도: ${expressionLevel}, 학습표현개수 : ${expressionNumber}, ${prompt}`;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: fullPrompt,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw error;
    }
};

module.exports = { getVideoCaptions, getCaptionText, saveCaption, getCaption, getChatResponse };
