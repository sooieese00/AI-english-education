const express = require('express');
const { registerUser, saveExpressionPreferences } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/save-expression-level', verifyToken, saveExpressionPreferences);

module.exports = router;
