const express = require('express');
const { fetchVideoDetails } = require('../controllers/youtubeController');
const router = express.Router();

router.post('/details/:videoId', fetchVideoDetails);

module.exports = router;
