const axios = require('axios');
const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const getChatResponse = async (prompt) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: prompt,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
            }
        );
        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw error;
    }
};

module.exports = getChatResponse;
