const express = require('express');
const { generateVoice } = require('../services/playhtService');

const router = express.Router();

router.post('/voice', async (req, res) => {
    const { text, voice } = req.body;
    try {
        const audioData = await generateVoice(text, voice);
        res.json(audioData);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
