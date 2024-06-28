const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const generateVoice = async (text, voice) => {
    let voiceUrl;
    
    if (voice === 'hagrid') {
        voiceUrl = process.env.HAGRID_VOICE_URL;
    } else if (voice === 'younYuhJung') {
        voiceUrl = process.env.YOUNYUHJUNG_VOICE_URL;
    } else {
        throw new Error('Invalid voice selected');
    }

    try {
        const response = await axios.post('https://api.play.ht/api/v2/tts', {
            text: text,
            voice: voiceUrl,
            output_format: 'mp3',
            voice_engine: 'PlayHT2.0'
        }, {
            headers: {
                'accept': 'text/event-stream',
                'content-type': 'application/json',
                'AUTHORIZATION': process.env.PLAYHT_API_KEY,
                'X-USER-ID': process.env.PLAYHT_USER_ID
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error generating voice:', error);
        throw error;
    }
};

module.exports = { generateVoice };
