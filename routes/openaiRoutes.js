const express = require('express');
const { generateImage, generateText } = require('../controllers/openaiController');
const router = express.Router();

router.post('/generateimage', generateImage);
router.post('/generateText', generateText);

module.exports = router;
