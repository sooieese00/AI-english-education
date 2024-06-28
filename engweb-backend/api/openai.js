const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL_OPENAI = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const getChatResponse = async (text) => {
    try {
        const response = await axios.post(
            BASE_URL_OPENAI,
            {
                prompt: text,
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
