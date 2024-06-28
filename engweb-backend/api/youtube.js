const axios = require('axios');
const { Caption } = require('../models/Caption'); // 경로 수정
const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL_YOUTUBE = 'https://www.googleapis.com/youtube/v3';

// Fetch video captions
const getVideoCaptions = async (videoId) => {
    try {
        const response = await axios.get(`${BASE_URL_YOUTUBE}/captions`, {
            params: {
                part: 'snippet',
                videoId: videoId,
                key: YOUTUBE_API_KEY,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching video captions:', error);
        throw error;
    }
};

// Fetch caption text by ID
const getCaptionText = async (captionId) => {
    try {
        const response = await axios.get(`${BASE_URL_YOUTUBE}/captions/${captionId}`, {
            params: {
                tfmt: 'sbv',
                key: YOUTUBE_API_KEY,
            },
            headers: {
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching caption text:', error);
        throw error;
    }
};

// Save caption to the database
const saveCaption = async (videoId, captionId, text) => {
    const newCaption = new Caption({ videoId, captionId, text });
    await newCaption.save();
    console.log('Caption saved:', newCaption);
};

// Get caption from the database
const getCaption = async (videoId) => {
    return await Caption.findOne({ videoId });
};

module.exports = { getVideoCaptions, getCaptionText, saveCaption, getCaption };
