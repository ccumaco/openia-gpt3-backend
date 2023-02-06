const express = require('express');
const { verifyToken } = require('../controllers/authController');
const { generateImage, generateText } = require('../controllers/openaiController');
const router = express.Router();



router.post('/generateimage', verifyToken, generateImage);
router.post('/generateText', verifyToken, generateText);

module.exports = router;
